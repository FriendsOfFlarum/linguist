<?php

namespace FoF\Linguist\Extenders;

use Flarum\Extend\ExtenderInterface;
use Flarum\Extension\Extension;
use Flarum\Foundation\Event\ClearingCache;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Contracts\Container\Container;

class ClearCacheStatus implements ExtenderInterface
{
    public function extend(Container $container, Extension $extension = null)
    {
        $container['events']->listen(ClearingCache::class, [$this, 'clearing']);
    }

    public function clearing(ClearingCache $event)
    {
        /**
         * @var $settings SettingsRepositoryInterface
         */
        $settings = app(SettingsRepositoryInterface::class);

        // When the cache has been cleared, either from Linguist tab or anywhere else, we remove our flag
        $settings->delete('fof.linguist.should-clear-cache');
    }
}
