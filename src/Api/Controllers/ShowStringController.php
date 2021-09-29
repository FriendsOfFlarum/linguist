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

    protected $strings;

    public function __construct(StringRepository $strings)
    {
        $this->strings = $strings;
    }

    protected function data(ServerRequestInterface $request, Document $document)
    {
        RequestUtil::getActor($request)->assertAdmin();

        $key = Arr::get($request->getQueryParams(), 'key');

        return $this->strings->getByKey($key);
    }
}
