<?php

namespace FoF\Linguist\Api\Controllers;

use FoF\Linguist\Api\Serializers\StringKeySerializer;
use FoF\Linguist\Repositories\DefaultStringsRepository;
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
