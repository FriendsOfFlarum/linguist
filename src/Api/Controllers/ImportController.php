<?php

namespace FoF\Linguist\Api\Controllers;

use Flarum\Foundation\ValidationException;
use FoF\Linguist\Repositories\StringRepository;
use FoF\Linguist\TextString;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use Laminas\Diactoros\Response\JsonResponse;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Symfony\Component\Yaml\Exception\ParseException;
use Symfony\Component\Yaml\Yaml;

class ImportController implements RequestHandlerInterface
{
    protected $repository;

    public function __construct(StringRepository $repository)
    {
        $this->repository = $repository;
    }

    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $request->getAttribute('actor')->assertAdmin();

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

        $totalImported = 0;
        $totalIgnored = 0;
        $totalIdentical = 0;

        foreach ($translations as $key => $value) {
            if (!is_string($key) || !Str::contains($key, '.')) {
                throw new ValidationException([
                    'input' => 'Invalid translation key ' . $key,
                ]);
            }

            /**
             * @var TextString $string
             */
            $string = TextString::query()
                ->where('locale', $locale)
                ->where('key', $key)
                ->first();

            if ($string) {
                if (Arr::get($request->getParsedBody(), 'ignoreExisting')) {

                    $totalIgnored++;
                    continue;
                } else if ($string->value === $value) {
                    $totalIdentical++;
                    continue;
                }
            } else {
                $string = new TextString();
                $string->key = $key;
                $string->locale = $locale;
            }

            $string->value = $value;
            $string->save();

            $totalImported++;
        }

        if ($totalImported > 0) {
            $this->repository->cacheShouldBeCleared();
        }

        return new JsonResponse([
            'imported' => $totalImported,
            'ignored' => $totalIgnored,
            'identical' => $totalIdentical,
        ]);
    }
}
