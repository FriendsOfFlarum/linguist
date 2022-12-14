<?php

namespace FoF\Linguist\Repositories;

use Flarum\Foundation\Config;
use Flarum\Settings\SettingsRepositoryInterface;

class CacheStatusRepository
{
    protected $settings;
    protected $config;

    const SHOULD_CLEAR_SETTING_KEY = 'fof.linguist.should-clear-cache';
    const LAST_EDIT_SETTING_KEY = 'fof.linguist.last-edit-date.';

    public function __construct(SettingsRepositoryInterface $settings, Config $config)
    {
        $this->settings = $settings;
        $this->config = $config;
    }

    /**
     * To be called every time a customized translation is modified
     * @param string|null $locale Locale that received updates or null for the special "all"
     */
    public function translationWasModified(string $locale = null): void
    {
        // No need to ask the user to clear cache if debug mode is on, the translations will be refreshed on next request already
        if (!$this->config->inDebugMode()) {
            // This flags lets the frontend know it should suggest to the user to clear the cache
            $this->settings->set(self::SHOULD_CLEAR_SETTING_KEY, '1');
        }

        // Save the last edit date for use in the translator's isFresh logic
        // Use one key per locale to reduce the performance impact in debug mode by only refreshing the locales that were modified
        $this->settings->set(self::LAST_EDIT_SETTING_KEY . ($locale ?? 'all'), time());
    }

    /**
     * To be called from an event listener for Flarum manual cache clear
     */
    public function cacheWasCleared(): void
    {
        // When the cache has been cleared, either from Linguist tab or anywhere else, we remove our flag
        $this->settings->delete(self::SHOULD_CLEAR_SETTING_KEY);
    }

    /**
     * Returns the date of last change to customized translations for the given locale, to be used in the translator freshness checker
     * @param string $locale Locale key
     * @return int UNIX timestamp
     */
    public function freshness(string $locale): int
    {
        // Cast to int will return 0 until a first translation is customized,
        // This also covers older installations that have not made any change since updating Linguist
        // where it will be read as up to date since the last translation timestamp will always be above zero
        // We need to check both the current locale and the special "all" locale for updates
        return max(
            (int)$this->settings->get(self::LAST_EDIT_SETTING_KEY . $locale),
            (int)$this->settings->get(self::LAST_EDIT_SETTING_KEY . 'all')
        );
    }
}
