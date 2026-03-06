<?php

namespace FoF\Linguist\Listeners;

use FoF\Linguist\Repositories\CacheStatusRepository;

class ClearCacheStatus
{
    public function __construct(protected CacheStatusRepository $cacheStatus)
    {
    }

    public function handle(): void
    {
        $this->cacheStatus->cacheWasCleared();
    }
}
