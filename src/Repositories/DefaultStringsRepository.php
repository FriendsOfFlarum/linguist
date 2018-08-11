<?php

namespace Flagrow\Linguist\Repositories;

use Flarum\Locale\LocaleManager;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Contracts\Events\Dispatcher;
use Flarum\Locale\Translator;

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
         * @var LocaleManager $manager
         * @var Translator $translator
         */
        $manager = app(LocaleManager::class);
        $translator = $manager->getTranslator();

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
