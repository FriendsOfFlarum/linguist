<?php

namespace FoF\Linguist\Api\Controllers;

use Flarum\Foundation\ValidationException;
use Flarum\Http\RequestUtil;
use FoF\Linguist\Repositories\CacheStatusRepository;
use FoF\Linguist\TextString;
use FoF\Linguist\Translator\IcuSyntax;
use Illuminate\Database\ConnectionInterface;
use Illuminate\Support\Arr;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;
use Laminas\Diactoros\Response\JsonResponse;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Symfony\Component\Yaml\Exception\ParseException;
use Symfony\Component\Yaml\Yaml;

class ImportController implements RequestHandlerInterface
{
    // Length of the key column
    const MAX_KEY_LENGTH = 180;

    public function __construct(protected CacheStatusRepository $cacheStatus, protected ConnectionInterface $db)
    {
    }

    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        RequestUtil::getActor($request)->assertAdmin();

        $locale = Arr::get($request->getParsedBody(), 'locale', 'en');

        if ($locale === 'all') {
            $locale = null;
        }

        try {
            $yaml = Yaml::parse(Arr::get($request->getParsedBody(), 'input', ''));
        } catch (ParseException $exception) {
            throw new ValidationException([
                'input' => 'Could not parse Yaml: ' . $exception->getMessage(),
            ]);
        }

        if (!is_array($yaml)) {
            throw new ValidationException([
                'input' => 'Yaml file must contain an array',
            ]);
        }

        $translations = Arr::dot($yaml);

        $totalIgnored = 0;
        $totalIdentical = 0;
        $totalEmpty = 0;

        // Check every entry before saving any, so a bad entry cannot leave the import half done
        foreach ($translations as $key => $value) {
            if (!is_string($key) || !Str::contains($key, '.')) {
                throw new ValidationException([
                    'input' => 'Invalid translation key ' . $key,
                ]);
            }

            if (mb_strlen($key) > self::MAX_KEY_LENGTH) {
                throw new ValidationException([
                    'input' => 'Translation key longer than ' . self::MAX_KEY_LENGTH . ' characters ' . $key,
                ]);
            }

            if ($value !== null && !is_string($value) && !is_int($value) && !is_float($value)) {
                throw new ValidationException([
                    'input' => 'Translation value must be text for key ' . $key,
                ]);
            }

            if (is_string($value) && !IcuSyntax::isValid($value)) {
                throw new ValidationException([
                    'input' => 'Invalid ICU message syntax for key ' . $key,
                ]);
            }
        }

        // One query for the strings this locale already has, rather than one per imported key
        $existing = TextString::query()->where('locale', $locale)->get()->keyBy('key');
        $ignoreExisting = (bool) Arr::get($request->getParsedBody(), 'ignoreExisting');

        $newRows = [];
        $changedStrings = [];

        foreach ($translations as $key => $value) {
            // A key without a value means it has not been translated
            if ($value === null || $value === '') {
                $totalEmpty++;
                continue;
            }

            // Yaml reads values such as 10 as numbers
            $value = (string) $value;

            /** @var TextString|null $string */
            $string = $existing->get($key);

            if (!$string) {
                $newRows[] = ['key' => $key, 'locale' => $locale, 'value' => $value];
            } else if ($ignoreExisting) {
                $totalIgnored++;
            } else if ($string->value === $value) {
                $totalIdentical++;
            } else {
                $string->value = $value;
                $changedStrings[] = $string;
            }
        }

        $totalImported = count($newRows) + count($changedStrings);

        $this->db->transaction(function () use ($newRows, $changedStrings) {
            $now = Carbon::now();

            // Small enough batches to stay under the bound parameter limits of SQLite and PostgreSQL
            foreach (array_chunk($newRows, 100) as $rows) {
                TextString::query()->insert(array_map(
                    fn (array $row) => $row + ['created_at' => $now, 'updated_at' => $now],
                    $rows
                ));
            }

            foreach ($changedStrings as $string) {
                $string->save();
            }
        });

        if ($totalImported > 0) {
            $this->cacheStatus->translationWasModified();
        }

        return new JsonResponse([
            'imported' => $totalImported,
            'ignored' => $totalIgnored,
            'identical' => $totalIdentical,
            'empty' => $totalEmpty,
        ]);
    }
}
