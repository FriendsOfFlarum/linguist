<?php

namespace FoF\Linguist\Api\Controllers;

use Flarum\Locale\Translator;
use FoF\Linguist\TextString;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use Laminas\Diactoros\Response\TextResponse;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Symfony\Component\Yaml\Yaml;

class ExportController implements RequestHandlerInterface
{
    protected $translator;

    public function __construct(Translator $translator)
    {
        $this->translator = $translator;
    }

    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $request->getAttribute('actor')->assertAdmin();

        $locale = Arr::get($request->getQueryParams(), 'locale', 'en');

        if ($locale === 'all') {
            $locale = null;
        }

        $stringsQuery = TextString::query()
            ->where('locale', $locale);


        $namespace = Arr::get($request->getQueryParams(), 'namespace');

        if ($namespace) {
            $stringsQuery->where('key', 'like', $namespace . '.%');
        }

        $translations = $stringsQuery->orderBy('key')->pluck('value', 'key');

        if (Arr::get($request->getQueryParams(), 'includeAll')) {
            $allQuery = TextString::query()
                ->whereNull('locale');

            if ($namespace) {
                $allQuery->where('key', 'like', $namespace . '.%');
            }

            // Override base keys with "all" keys
            $translations = $translations->merge($allQuery->pluck('value', 'key'));
        }

        if (Arr::get($request->getQueryParams(), 'includeOriginals') && $locale !== null) {
            $catalogue = $this->translator->getCatalogue($locale);

            $originals = $catalogue->all('messages');

            if ($namespace) {
                $originals = array_filter($originals, function ($key) use ($namespace) {
                    return Str::startsWith($key, $namespace . '.');
                }, ARRAY_FILTER_USE_KEY);
            }

            // Complete base with original translations if they are not customized
            $translations = collect($originals)->merge($translations);
        }

        if ($translations->isEmpty()) {
            $yaml = '';
        } else {
            $nestedTranslations = [];

            foreach ($translations as $key => $value) {
                $node = &$nestedTranslations;

                foreach (explode('.', $key) as $path) {
                    if (!array_key_exists($path, $node)) {
                        $node[$path] = [];
                    }

                    $node = &$node[$path];
                }

                $node = $value;
            }

            $yaml = Yaml::dump($nestedTranslations, 255);
        }

        // Some webservers might return cache headers since it's a text file
        // We try to prevent that by specifying cache control
        return (new TextResponse($yaml))->withAddedHeader('Cache-Control', 'no-cache');
    }
}
