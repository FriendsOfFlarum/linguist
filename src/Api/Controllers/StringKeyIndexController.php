<?php

namespace FoF\Linguist\Api\Controllers;

use FoF\Linguist\Api\Serializers\StringKeySerializer;
use FoF\Linguist\Repositories\DefaultStringsRepository;
use Flarum\Api\Controller\AbstractListController;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class StringKeyIndexController extends AbstractListController
{
    public $serializer = StringKeySerializer::class;

    protected $repository;

    public function __construct(DefaultStringsRepository $repository)
    {
        $this->repository = $repository;
    }

    /**
     * Retrieve and optionally filter translation string keys.
     *
     * @param ServerRequestInterface $request The server request containing filters.
     * @param Document $document The document to store the translation data.
     * @return Collection The collection of filtered translations.
     */
    protected function data(ServerRequestInterface $request, Document $document)
    {
        // Extract filters from the request.
        $filters = $this->extractFilter($request);

        // Look for the 'prefix' key in the filters.
        $prefix = Arr::get($filters, 'prefix', null);

        // If no prefix is provided, ensure the requestor is an admin.
        if (!$prefix) {
            $request->getAttribute('actor')->assertAdmin();
        }

        // Retrieve all translations from the repository.
        $all = $this->repository->allTranslations();

        // If a prefix is provided, filter the translations by that prefix.
        if ($prefix) {
            return $all->filter(function ($item) use ($prefix) {
                // Return true if the item's key starts with the provided prefix.
                return Str::startsWith($item['key'], $prefix);
            });
        } else {
            // If no prefix is provided, return all translations.
            return $all;
        }
    }
}
