<?php

namespace Flagrow\Linguist\Api\Controllers;

use Flagrow\Linguist\Api\Serializers\StringKeySerializer;
use Flagrow\Linguist\Repositories\DefaultStringsRepository;
use Flarum\Api\Controller\AbstractListController;
use Flarum\User\AssertPermissionTrait;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class StringKeyIndexController extends AbstractListController
{
    use AssertPermissionTrait;

    public $serializer = StringKeySerializer::class;

    protected function data(ServerRequestInterface $request, Document $document)
    {
        $this->assertAdmin($request->getAttribute('actor'));

        /**
         * @var $repository DefaultStringsRepository
         */
        $repository = app(DefaultStringsRepository::class);

        return $repository->allTranslations();
    }
}
