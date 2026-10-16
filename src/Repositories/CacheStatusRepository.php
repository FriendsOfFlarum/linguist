<?php

namespace FoF\Linguist\Repositories;

use Flarum\Foundation\Config;
use Flarum\Locale\LocaleManager;
use Flarum\Settings\SettingsRepositoryInterface;

class CacheStatusRepository
{
    const SHOULD_CLEAR_SETTING_KEY = 'fof.linguist.should-clear-cache';

    public function __construct(protected SettingsRepositoryInterface $settings, protected Config $config)
    {
    }

    /**
     * To be called every time a customized translation is modified
     */
    public function translationWasModified(): void
    {
        // No need to ask the user to clear cache if debug mode is on, the translations will be refreshed on next request already
        if (!$this->config->inDebugMode()) {
            // This flags lets the frontend know it should suggest to the user to clear the cache
            $this->settings->set(self::SHOULD_CLEAR_SETTING_KEY, '1');
        }

        // Flarum rebuilds compiled translations when this stamp changes, on every instance that shares the database
        $this->settings->set(LocaleManager::REVISION_STAMP_KEY, (string) microtime(true));
    }

    /**
     * To be called from an event listener for Flarum manual cache clear
     */
    public function cacheWasCleared(): void
    {
        // When the cache has been cleared, either from Linguist tab or anywhere else, we remove our flag
        $this->settings->delete(self::SHOULD_CLEAR_SETTING_KEY);
    }
}
