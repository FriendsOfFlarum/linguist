<?php

namespace FoF\Linguist\Translator;

use Flarum\Locale\LocaleManager;
use Symfony\Component\Translation\MessageCatalogueInterface;

class RegisterStringLoader
{
    public function __construct(protected StringLoader $loader)
    {
    }

    public function __invoke(LocaleManager $locales): void
    {
        $translator = $locales->getTranslator();

        $translator->addLoader('fof_linguist', $this->loader);

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
            // Flarum registers its translations in the ICU domain, so overrides must go there too
            // or the translator formats them without ICU support
            $translator->addResource('fof_linguist', null, $locale, 'messages'.MessageCatalogueInterface::INTL_DOMAIN_SUFFIX);
        }
    }
}
