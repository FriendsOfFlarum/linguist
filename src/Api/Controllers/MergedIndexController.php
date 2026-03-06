<?php

namespace FoF\Linguist\Api\Controllers;

use Flarum\Api\Controller\AbstractListController;
use Flarum\Http\RequestUtil;
use FoF\Linguist\Api\Serializers\StringKeySerializer;
use FoF\Linguist\Repositories\DefaultStringsRepository;
use FoF\Linguist\Repositories\MergedStringsRepository;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

/**
 * @TODO: Remove this in favor of one of the API resource classes that were added.
 *      Or extend an existing API Resource to add this to.
 *      Or use a vanilla RequestHandlerInterface controller.
 *      @link https://docs.flarum.org/2.x/extend/api#endpoints
 */
class MergedIndexController extends AbstractListController
{
    public $serializer = StringKeySerializer::class;

    public function __construct(protected MergedStringsRepository $mergedStrings, protected DefaultStringsRepository $defaultStrings)
    {
    }

    protected function data(ServerRequestInterface $request, Document $document)
    {
        RequestUtil::getActor($request)->assertCan('viewStringKeys');

        // Extract filters from the request.
        $filters = $this->extractFilter($request);
        $filter = $this->defaultStrings->getPrefix($filters);
        
        return $this->mergedStrings->getTranslations($filter);
    }
}
