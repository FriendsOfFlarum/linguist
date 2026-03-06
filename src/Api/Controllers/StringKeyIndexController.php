<?php

namespace FoF\Linguist\Api\Controllers;

use FoF\Linguist\Api\Serializers\StringKeySerializer;
use FoF\Linguist\Repositories\DefaultStringsRepository;
use Flarum\Api\Controller\AbstractListController;
use Flarum\Http\RequestUtil;
use Illuminate\Support\Collection;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

/**
 * @TODO: Remove this in favor of one of the API resource classes that were added.
 *      Or extend an existing API Resource to add this to.
 *      Or use a vanilla RequestHandlerInterface controller.
 *      @link https://docs.flarum.org/2.x/extend/api#endpoints
 */
class StringKeyIndexController extends AbstractListController
{
    public $serializer = StringKeySerializer::class;

    public function __construct(protected DefaultStringsRepository $repository)
    {
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
        RequestUtil::getActor($request)->assertCan('viewStringKeys');

        // Extract filters from the request.
        $filters = $this->extractFilter($request);

        // Retrieve all translations from the default repository.
        return $this->repository->allTranslations($this->repository->getPrefix($filters));
    }
}
