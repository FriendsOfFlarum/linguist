<?php

namespace Flagrow\Linguist\Listeners;

use Flagrow\Linguist\Api\Controllers;
use Flarum\Event\ConfigureApiRoutes;
use Illuminate\Contracts\Events\Dispatcher;

class AddApiRoutes
{
    public function subscribe(Dispatcher $events)
    {
        $events->listen(ConfigureApiRoutes::class, [$this, 'routes']);
    }

    public function routes(ConfigureApiRoutes $routes)
    {
        $routes->get(
            '/flagrow/linguist/strings',
            'flagrow.linguist.api.strings.index',
            Controllers\StringIndexController::class
        );
        $routes->post(
            '/flagrow/linguist/strings',
            'flagrow.linguist.api.strings.store',
            Controllers\StringStoreController::class
        );
        $routes->patch(
            '/flagrow/linguist/strings/{id:[0-9]+}',
            'flagrow.linguist.api.strings.update',
            Controllers\StringUpdateController::class
        );
        $routes->delete(
            '/flagrow/linguist/strings/{id:[0-9]+}',
            'flagrow.linguist.api.strings.delete',
            Controllers\StringDeleteController::class
        );

        $routes->get(
            '/flagrow/linguist/string-keys',
            'flagrow.linguist.api.string-keys.index',
            Controllers\StringKeyIndexController::class
        );
    }
}
