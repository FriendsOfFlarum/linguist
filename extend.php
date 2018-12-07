<?php

namespace Flagrow\Linguist;

use Flarum\Extend;
use Illuminate\Contracts\Events\Dispatcher;
use Flagrow\Linguist\Api\Controllers;

return [
    (new Extend\Frontend('admin'))
        ->js(__DIR__.'/js/dist/admin.js')
        ->css(__DIR__.'/resources/less/admin.less'),
    new Extend\Locales(__DIR__ . '/resources/locale'),
    (new Extend\Routes('api'))
        ->get('/flagrow/linguist/string-keys', 'flagrow.linguist.api.string-keys.index', Controllers\StringKeyIndexController::class)
        ->get('/flagrow/linguist/strings', 'flagrow.linguist.api.strings.index', Controllers\StringIndexController::class)
        ->post('/flagrow/linguist/strings', 'flagrow.linguist.api.strings.store', Controllers\StringStoreController::class)
        ->patch('/flagrow/linguist/strings/{id:[0-9]+}', 'flagrow.linguist.api.strings.update', Controllers\StringUpdateController::class)
        ->delete('/flagrow/linguist/strings/{id:[0-9]+}', 'flagrow.linguist.api.strings.delete', Controllers\StringDeleteController::class),
    function (Dispatcher $events) {
        $events->subscribe(Listeners\LoadStrings::class);
    }
];
