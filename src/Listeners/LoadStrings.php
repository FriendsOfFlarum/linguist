<?php

namespace Flagrow\Linguist\Listeners;

use Flagrow\Linguist\StringLoader;
use Flarum\Api\Event\Serializing;
use Flarum\Locale\LocaleManager;
use Illuminate\Contracts\Events\Dispatcher;

class LoadStrings
{
    public function subscribe(Dispatcher $events)
    {
        // We need to make sure this runs after every other locale listeners
        // In particular the list of locales need to be complete when this runs
        $events->listen(Serializing::class, [$this, 'addLocales']);
    }

    public function addLocales()
    {
        $manager = app(LocaleManager::class);
        $translator = $manager->getTranslator();

        $translator->addLoader('flagrow_linguist', app(StringLoader::class));

        // Add the custom loader to every language available in Flarum
        foreach ($manager->getLocales() as $locale => $name) {
            // The resource does not actually contain any data,
            // it will be fetched from the database when the loader runs
            $translator->addResource('flagrow_linguist', null, $locale);
        }
    }
}
