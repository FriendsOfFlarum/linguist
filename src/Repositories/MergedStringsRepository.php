<?php

namespace FoF\Linguist\Repositories;

use Illuminate\Support\Str;
use Symfony\Contracts\Translation\TranslatorInterface;

class MergedStringsRepository
{
/**
     * @var DefaultStringsRepository
     */
    protected $defaultStrings;

    /**
     * @var StringRepository
     */
    protected $strings;

    /**
     * @var TranslatorInterface
     */
    protected $translator;

    public function __construct(
        DefaultStringsRepository $defaultStrings,
        StringRepository $strings,
        TranslatorInterface $translator
    ) {
        $this->defaultStrings = $defaultStrings;
        $this->strings = $strings;
        $this->translator = $translator;
    }

    public function getTranslations(?string $filter)
    {
        // Retrieve all translations from the default repository and returns a Collection.
        // @example
        //  array:2 [▼
        // "key" => "acme-foobar.forum.example_string"
        //   "locales" => array:4 [▼
        //     "en" => "${count} more ${ count === 1 ? `question` : `questions` }"
        //     "de" => "${count} weitere ${ count === 1 ? `Frage` : `Fragen` }"
        //     "it" => "${count} altre ${ count === 1 ? `domanda` : `domande` }"
        //     "fr" => "${count} autres ${ count === 1 ? `question` : `questions` }"
        //   ]
        // ]
        $all = $this->defaultStrings->allTranslations($filter);
        $allKeys = $all->pluck('key');

        $modified = $this->strings->getByKeys($allKeys->toArray());

        foreach ($modified as $textString) {
            $updates = [];
            $locale = $textString->locale;
            $translation = $textString->value;

            if (Str::startsWith($translation, '=>')) {
                $key = trim(Str::after($translation, '=>'));

                if (empty($key)) {
                    continue;
                }
                $translation = $this->translator->trans($key, [], null, $locale);
            }

            $updates[$locale] = $translation;

            $locales = array_merge($all[$textString->key]['locales'], $updates);

            $all->put($textString->key, ['key' => $textString->key, 'locales' => $locales]);
        }

        return $all;
    }
}
