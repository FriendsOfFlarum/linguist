<?php

namespace FoF\Linguist\Api\Controllers;

use FoF\Linguist\Api\Serializers\StringSerializer;
use FoF\Linguist\Repositories\StringRepository;
use Flarum\Api\Controller\AbstractListController;
use Flarum\Http\RequestUtil;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class StringIndexController extends AbstractListController
{
    public $serializer = StringSerializer::class;

    public function __construct(protected StringRepository $strings)
    {
    }

    protected function data(ServerRequestInterface $request, Document $document)
    {
        RequestUtil::getActor($request)->assertAdmin();

        return $this->strings->all();
    }
}
