<?php

namespace FoF\Linguist\Listeners;

use FoF\Linguist\Repositories\CacheStatusRepository;

class ClearCacheStatus
{
    protected $cacheStatus;

    public function __construct(CacheStatusRepository $cacheStatus)
    {
        $this->cacheStatus = $cacheStatus;
    }

    public function handle()
    {
        $this->cacheStatus->cacheWasCleared();
    }
}
