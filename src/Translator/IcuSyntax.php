<?php

namespace FoF\Linguist\Translator;

class IcuSyntax
{
    /**
     * Whether the ICU formatter Flarum uses for translations can parse the message
     */
    public static function isValid(string $message, string $locale = 'en'): bool
    {
        try {
            return \MessageFormatter::create($locale, $message) !== null;
        } catch (\IntlException) {
            return false;
        }
    }
}
