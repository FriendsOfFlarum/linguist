<?php

namespace FoF\Linguist\Providers;

use Flarum\Foundation\AbstractServiceProvider;
use Flarum\Locale\LocaleManager;
use FoF\Linguist\Translator\StringLoader;

class LoadStrings extends AbstractServiceProvider
{
    public function register()
    {
        // Other extensions register their translations via `resolving()`, so we need to use `afterResolving()`
        // to put our custom loader at the end to be able to override all translations
        $this->container->afterResolving(
            LocaleManager::class,
            function (LocaleManager $locales) {
                $translator = $locales->getTranslator();

                $translator->addLoader('fof_linguist', $this->container->make(StringLoader::class));

                $localeKeys = array_keys($locales->getLocales());

                // Even if English is not enabled, it's still used by Flarum as the fallback language
                // So the loader must be added for custom English translations to apply when fallback is used
                if (!in_array('en', $localeKeys)) {
                    $localeKeys[] = 'en';
                }

                // Add the custom loader to every language available in Flarum
                foreach ($localeKeys as $locale) {
                    // The resource does not actually contain any data,
                    // it will be fetched from the database when the loader runs
                    $translator->addResource('fof_linguist', null, $locale);
                }
            }
        );
    }
}
