<?php

namespace Flagrow\Linguist;

class TranslationLock
{
    protected static $apply = true;

    public static function stopLoadingTranslations()
    {
        self::$apply = false;
    }

    public static function continueLoadingTranslations()
    {
        self::$apply = true;
    }

    public static function shouldLoadTranslations()
    {
        return self::$apply;
    }
}
