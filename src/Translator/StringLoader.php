<?php

namespace FoF\Linguist\Translator;

use FoF\Linguist\Repositories\StringRepository;
use FoF\Linguist\TranslationLock;
use Symfony\Component\Translation\Loader\LoaderInterface;
use Symfony\Component\Translation\MessageCatalogue;

class StringLoader implements LoaderInterface
{
    protected $repository;

    public function __construct(StringRepository $repository)
    {
        $this->repository = $repository;
    }

    /**
     * @inheritdoc
     */
    public function load($resource, $locale, $domain = 'messages')
    {
        $catalog = new MessageCatalogue($locale);

        // Prevent loading custom translations while we're trying to get the defaults
        if (!TranslationLock::shouldLoadTranslations()) {
            return $catalog;
        }

        $messages = [];

        foreach ($this->repository->stringsForLocale($locale) as $string) {
            $messages[$string->key] = $string->value;
        }

        $catalog->add($messages);

        $catalog->addResource(new DatabaseResource($locale));

        return $catalog;
    }
}
