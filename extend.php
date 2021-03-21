<?php

namespace FoF\Linguist;

use Flarum\Extend;
use Flarum\Foundation\Event\ClearingCache;
use FoF\Linguist\Api\Controllers;

return [
    (new Extend\Frontend('admin'))
        ->js(__DIR__.'/js/dist/admin.js')
        ->css(__DIR__.'/resources/less/admin.less'),
    new Extend\Locales(__DIR__ . '/resources/locale'),
    (new Extend\Routes('api'))
        ->get('/fof/linguist/string-keys', 'fof.linguist.api.string-keys.index', Controllers\StringKeyIndexController::class)
        ->get('/fof/linguist/strings', 'fof.linguist.api.strings.index', Controllers\StringIndexController::class)
        ->post('/fof/linguist/strings', 'fof.linguist.api.strings.store', Controllers\StringStoreController::class)
        ->patch('/fof/linguist/strings/{id:[0-9]+}', 'fof.linguist.api.strings.update', Controllers\StringUpdateController::class)
        ->delete('/fof/linguist/strings/{id:[0-9]+}', 'fof.linguist.api.strings.delete', Controllers\StringDeleteController::class)
        ->get('/fof/linguist/export', 'fof.linguist.api.export', Controllers\ExportController::class)
        ->post('/fof/linguist/import', 'fof.linguist.api.import', Controllers\ImportController::class),

    (new Extend\ServiceProvider())
        ->register(Providers\LoadStrings::class),

    (new Extend\Event())
        ->listen(ClearingCache::class, Listeners\ClearCacheStatus::class),
];
