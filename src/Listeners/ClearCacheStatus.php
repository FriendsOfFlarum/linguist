<?php

namespace FoF\Linguist\Listeners;

use Flarum\Foundation\Event\ClearingCache;
use Flarum\Settings\SettingsRepositoryInterface;

class ClearCacheStatus
{
    protected $settings;

    public function __construct(SettingsRepositoryInterface $settings)
    {
        $this->settings = $settings;
    }

    public function handle(ClearingCache $event)
    {
        // When the cache has been cleared, either from Linguist tab or anywhere else, we remove our flag
        $this->settings->delete('fof.linguist.should-clear-cache');
    }
}
