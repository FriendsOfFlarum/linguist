<?php

namespace FoF\Linguist\Api\Controllers;

use Flarum\Api\Controller\AbstractListController;
use Flarum\Http\RequestUtil;
use FoF\Linguist\Api\Serializers\StringSerializer;
use FoF\Linguist\Repositories\StringRepository;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class ShowStringController extends AbstractListController
{
    public $serializer = StringSerializer::class;

    public function __construct(protected StringRepository $strings)
    {
    }

    protected function data(ServerRequestInterface $request, Document $document)
    {
        RequestUtil::getActor($request)->assertAdmin();

        $key = Arr::get($request->getQueryParams(), 'key');

        return $this->strings->getByKey($key);
    }
}
