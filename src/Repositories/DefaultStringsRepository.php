<?php

namespace Flagrow\Linguist\Repositories;

use Flagrow\Linguist\TranslationLock;
use Flarum\Locale\LocaleManager;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Contracts\Events\Dispatcher;

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
        /**
         * @var $manager LocaleManager
         */
        $manager = app(LocaleManager::class);

        $translations = [];

        // We disable our own translation loader so custom strings don't replace original ones
        TranslationLock::stopLoadingTranslations();

        foreach (array_keys($manager->getLocales()) as $locale) {
            foreach (array_get($manager->getTranslator()->getCatalogue($locale)->all(), 'messages', []) as $key => $string) {
                if (!array_has($translations, $key)) {
                    $translations[$key] = [
                        'key' => $key,
                        'locales' => [],
                    ];
                }

                $translations[$key]['locales'][$locale] = $string;
            }
        }

        TranslationLock::continueLoadingTranslations();

        return collect($translations)->sortBy(function ($value, $key) {
            return $key;
        });
    }
}
