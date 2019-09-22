<?php

namespace FoF\Linguist\Extenders;

use Flarum\Extend\ExtenderInterface;
use Flarum\Extension\Extension;
use Flarum\Locale\LocaleManager;
use FoF\Linguist\Translator\StringLoader;
use Illuminate\Contracts\Container\Container;

class LoadStrings implements ExtenderInterface
{
    public function extend(Container $container, Extension $extension = null)
    {
        // Other extensions register their translations via `resolving()`, so we need to use `afterResolving()`
        // to put our custom loader at the end to be able to override all translations
        $container->afterResolving(
            LocaleManager::class,
            function (LocaleManager $locales) {
                $translator = $locales->getTranslator();

                $translator->addLoader('fof_linguist', app(StringLoader::class));

                // Add the custom loader to every language available in Flarum
                foreach ($locales->getLocales() as $locale => $name) {
                    // The resource does not actually contain any data,
                    // it will be fetched from the database when the loader runs
                    $translator->addResource('fof_linguist', null, $locale);
                }
            }
        );
    }
}
