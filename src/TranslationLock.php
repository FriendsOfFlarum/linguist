<?php

namespace FoF\Linguist;

class TranslationLock
{
    protected static $apply = true;

    public static function stopLoadingTranslations(): void
    {
        self::$apply = false;
    }

    public static function continueLoadingTranslations(): void
    {
        self::$apply = true;
    }

    public static function shouldLoadTranslations(): bool
    {
        return self::$apply;
    }
}
