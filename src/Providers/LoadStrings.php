<?php

namespace FoF\Linguist\Providers;

use Flarum\Foundation\AbstractServiceProvider;
use Flarum\Locale\LocaleManager;
use FoF\Linguist\Translator\RegisterStringLoader;

class LoadStrings extends AbstractServiceProvider
{
    public function register()
    {
        // Other extensions register their translations via `resolving()`, so we need to use `afterResolving()`
        // to put our custom loader at the end to be able to override all translations
        $this->container->afterResolving(
            LocaleManager::class,
            function (LocaleManager $locales) {
                $this->container->make(RegisterStringLoader::class)($locales);
            }
        );
    }
}
