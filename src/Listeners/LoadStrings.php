<?php

namespace Flagrow\Linguist\Listeners;

use Flagrow\Linguist\StringLoader;
use Flagrow\Linguist\TranslationLock;
use Flarum\Event\ConfigureLocales;
use Illuminate\Contracts\Events\Dispatcher;

class LoadStrings
{
    public function subscribe(Dispatcher $events)
    {
        // We need to make sure this runs after every other locale listeners
        // In particular the list of locales need to be complete when this runs
        $events->listen(ConfigureLocales::class, [$this, 'addLocales'], -10);
    }

    public function addLocales(ConfigureLocales $event)
    {
        // Prevent loading translations while we're trying to get the defaults
        if (!TranslationLock::shouldLoadTranslations()) {
            return;
        }

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
