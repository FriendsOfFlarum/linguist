<?php

namespace FoF\Linguist\Translator;

use FoF\Linguist\Repositories\StringRepository;
use FoF\Linguist\TextString;
use FoF\Linguist\TranslationLock;
use Symfony\Component\Translation\Loader\LoaderInterface;
use Symfony\Component\Translation\MessageCatalogue;

class StringLoader implements LoaderInterface
{
    public function __construct(protected StringRepository $repository)
    {
    }

    /**
     * @inheritdoc
     */
    public function load(mixed $resource, string $locale, string $domain = 'messages'): MessageCatalogue
    {
        $catalog = new MessageCatalogue($locale);

        // Prevent loading custom translations while we're trying to get the defaults
        if (!TranslationLock::shouldLoadTranslations()) {
            return $catalog;
        }

        $messages = [];
        $plainMessages = [];

        // "All locales" rows first, so a locale's own override replaces them whichever way the database sorts null
        $strings = $this->repository->stringsForLocale($locale)
            ->sortBy(fn (TextString $string) => $string->locale !== null);

        foreach ($strings as $string) {
            if (IcuSyntax::isValid($string->value, $locale)) {
                $messages[$string->key] = $string->value;
                unset($plainMessages[$string->key]);
            } else {
                $plainMessages[$string->key] = $string->value;
                unset($messages[$string->key]);
            }
        }

        $catalog->add($messages, $domain);

        // The ICU formatter throws on invalid syntax, so these stay in the plain domain where they are output as written
        $catalog->add($plainMessages);

        return $catalog;
    }
}
