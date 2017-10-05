<?php

namespace Flagrow\Linguist;

use Flagrow\Linguist\Repositories\StringRepository;
use Symfony\Component\Translation\Loader\LoaderInterface;
use Symfony\Component\Translation\MessageCatalogue;

class StringLoader implements LoaderInterface
{
    /**
     * @inheritdoc
     */
    public function load($resource, $locale, $domain = 'messages')
    {
        $catalog = new MessageCatalogue($locale);

        /**
         * @var $strings StringRepository
         */
        $strings = app(StringRepository::class);

        $messages = [];

        foreach ($strings->stringsForLocale($locale) as $string) {
            $messages[$string->key] = $string->value;
        }

        $catalog->add($messages);

        return $catalog;
    }
}
