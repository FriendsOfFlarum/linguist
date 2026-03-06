<?php

namespace FoF\Linguist\Api\Controllers;

use FoF\Linguist\Api\Serializers\StringKeySerializer;
use FoF\Linguist\Repositories\DefaultStringsRepository;
use Flarum\Api\Controller\AbstractShowController;
use Flarum\Http\RequestUtil;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class ShowStringKeyController extends AbstractShowController
{
    public $serializer = StringKeySerializer::class;

    public function __construct(protected DefaultStringsRepository $repository)
    {
    }

    protected function data(ServerRequestInterface $request, Document $document)
    {
        RequestUtil::getActor($request)->assertCan('viewStringKeys');

        $key = Arr::get($request->getQueryParams(), 'key');

        return $this->repository->getTranslation($key);
    }
}
