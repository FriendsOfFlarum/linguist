<?php

namespace FoF\Linguist\Api\Controllers;

use FoF\Linguist\Api\Serializers\StringSerializer;
use FoF\Linguist\Repositories\StringRepository;
use Flarum\Api\Controller\AbstractShowController;
use Flarum\Http\RequestUtil;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class StringUpdateController extends AbstractShowController
{
    public $serializer = StringSerializer::class;

    public function __construct(protected StringRepository $strings)
    {
    }

    protected function data(ServerRequestInterface $request, Document $document)
    {
        RequestUtil::getActor($request)->assertAdmin();

        $id = Arr::get($request->getQueryParams(), 'id');

        $field = $this->strings->findOrFail($id);

        $attributes = Arr::get($request->getParsedBody(), 'data.attributes', []);

        return $this->strings->update($field, $attributes);
    }
}
