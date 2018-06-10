<?php

namespace Flagrow\Linguist\Repositories;

use Flagrow\Linguist\TranslationLock;
use Flarum\Event\ConfigureLocales;
use Flarum\Locale\LocaleManager;
use Flarum\Locale\PrefixedYamlFileLoader;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Contracts\Events\Dispatcher;
use Symfony\Component\Translation\MessageSelector;
use Symfony\Component\Translation\Translator;

class DefaultStringsRepository
{
    protected $settings;
    protected $events;

    public function __construct(SettingsRepositoryInterface $settings, Dispatcher $events)
    {
        $this->settings = $settings;
        $this->events = $events;
    }

    public function allTranslations()
    {
        // Based on Flarum\Locale\LocaleServiceProvider@getDefaultLocale
        $defaultLocale = $this->settings->get('default_locale', 'en');

        // Based on Flarum\Locale\LocaleServiceProvider@register
        $translator = new Translator($defaultLocale, new MessageSelector());
        $translator->setFallbackLocales([$defaultLocale, 'en']);
        $translator->addLoader('prefixed_yaml', new PrefixedYamlFileLoader());

        // Based on Flarum\Locale\LocaleServiceProvider@boot
        $manager = new LocaleManager($translator);
        $manager->addLocale($defaultLocale, 'Default');

        TranslationLock::stopLoadingTranslations();

        // Make all extensions load their translations to our own manager
        // The TranslationLock prevents user-defined translations from being loaded here
        $this->events->fire(new ConfigureLocales($manager));

        TranslationLock::continueLoadingTranslations();

        // Now extract all content from the manager and translator

        $translations = [];

        foreach (array_keys($manager->getLocales()) as $locale) {
            foreach (array_get($translator->getCatalogue($locale)->all(), 'messages', []) as $key => $string) {
                if (!array_has($translations, $key)) {
                    $translations[$key] = [
                        'key' => $key,
                        'locales' => [],
                    ];
                }

                $translations[$key]['locales'][$locale] = $string;
            }
        }

        return collect($translations)->sortBy(function ($value, $key) {
            return $key;
        });
    }
}
