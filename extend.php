<?php

namespace FoF\Linguist;

use Flarum\Extend;
use Flarum\Foundation\Event\ClearingCache;
use FoF\Linguist\Api\Controllers;
use FoF\Linguist\Api\Resource;

return [
    (new Extend\Frontend('admin'))
        ->js(__DIR__.'/js/dist/admin.js')
        ->css(__DIR__.'/resources/less/admin.less'),

    (new Extend\Frontend('backoffice'))
        ->js(__DIR__.'/js/dist/admin.js')
        ->css(__DIR__.'/resources/less/admin.less'),

    new Extend\Locales(__DIR__ . '/resources/locale'),

    new Extend\ApiResource(Resource\TextStringResource::class),
    new Extend\ApiResource(Resource\StringKeyResource::class),

    (new Extend\Routes('api'))
        ->get('/fof/linguist/export', 'fof.linguist.api.export', Controllers\ExportController::class)
        ->post('/fof/linguist/import', 'fof.linguist.api.import', Controllers\ImportController::class),

    (new Extend\ServiceProvider())
        ->register(Providers\LoadStrings::class),

    (new Extend\Event())
        ->listen(ClearingCache::class, Listeners\ClearCacheStatus::class),
];
