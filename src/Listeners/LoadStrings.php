<?php

namespace Flagrow\Linguist\Listeners;

use Flagrow\Linguist\StringLoader;
use Flarum\Event\ConfigureLocales;
use Illuminate\Contracts\Events\Dispatcher;

class LoadStrings
{
    public function subscribe(Dispatcher $events)
    {
        // Using the deprecated event for locales configuration, our code should run
        // after every extension has registered its locales and translations via the extender
        $events->listen(ConfigureLocales::class, [$this, 'addLocales']);
    }

    public function addLocales(ConfigureLocales $event)
    {
        $translator = $event->locales->getTranslator();

        $translator->addLoader('flagrow_linguist', app(StringLoader::class));

        // Add the custom loader to every language available in Flarum
        foreach ($event->locales->getLocales() as $locale => $name) {
            // The resource does not actually contain any data,
            // it will be fetched from the database when the loader runs
            $translator->addResource('flagrow_linguist', null, $locale);
        }
    }
}
