<?php

namespace Flagrow\Linguist;

use Illuminate\Contracts\Events\Dispatcher;

return function (Dispatcher $events) {
    $events->subscribe(Listeners\AddApiRoutes::class);
    $events->subscribe(Listeners\AddClientAssets::class);
    $events->subscribe(Listeners\LoadStrings::class);
};
