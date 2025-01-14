<?php

namespace FoF\Linguist\Api\Controllers;

use Flarum\Api\Controller\AbstractListController;
use Flarum\Http\RequestUtil;
use FoF\Linguist\Api\Serializers\StringKeySerializer;
use FoF\Linguist\Repositories\DefaultStringsRepository;
use FoF\Linguist\Repositories\StringRepository;
use FoF\Linguist\TextString;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class MergedIndexController extends AbstractListController
{
    public $serializer = StringKeySerializer::class;

    /**
     * @var DefaultStringsRepository
     */
    protected $defaultStrings;

    /**
     * @var StringRepository
     */
    protected $strings;

    public function __construct(
        DefaultStringsRepository $defaultStrings,
        StringRepository $strings
    ) {
        $this->defaultStrings = $defaultStrings;
        $this->strings = $strings;
    }

    protected function data(ServerRequestInterface $request, Document $document)
    {
        RequestUtil::getActor($request)->assertCan('viewStringKeys');

        // Extract filters from the request.
        $filters = $this->extractFilter($request);
        $filter = $this->defaultStrings->getPrefix($filters);

        // Retrieve all translations from the default repository and returns a Collection.
        // @example
        //  array:2 [▼
        // "key" => "glowingblue-integrable.ui.discussions.show_more"
        //   "locales" => array:4 [▼
        //     "en" => "${count} more ${ count === 1 ? `question` : `questions` }"
        //     "de" => "${count} weitere ${ count === 1 ? `Frage` : `Fragen` }"
        //     "it" => "${count} altre ${ count === 1 ? `domanda` : `domande` }"
        //     "fr" => "${count} autres ${ count === 1 ? `question` : `questions` }"
        //   ]
        // ]
        $all = $this->defaultStrings->allTranslations($filter);

        foreach ($all as $translationKey) {
            $key = Arr::get($translationKey, 'key');
            $resultsForKey = $this->strings->getByKey($key);

            $updates = [];

            foreach ($resultsForKey as $textString) {
                /** @var TextString $textString */
                $locale = $textString->locale;
                $translation = $textString->value;

                $updates[$locale] = $translation;
            }

            $locales = array_merge($translationKey['locales'], $updates);
            $all->put($key, ['key' => $key, 'locales' => $locales]);
        }

        return $all;
    }
}
