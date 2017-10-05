<?php

namespace Flagrow\Linguist\Api\Controllers;

use Flagrow\Linguist\Api\Serializers\StringSerializer;
use Flagrow\Linguist\Repositories\StringRepository;
use Flarum\Api\Controller\AbstractCreateController;
use Flarum\Core\Access\AssertPermissionTrait;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class StringStoreController extends AbstractCreateController
{
    use AssertPermissionTrait;

    public $serializer = StringSerializer::class;

    /**
     * @var StringRepository
     */
    protected $strings;

    public function __construct(StringRepository $strings)
    {
        $this->strings = $strings;
    }

    protected function data(ServerRequestInterface $request, Document $document)
    {
        $this->assertAdmin($request->getAttribute('actor'));

        $attributes = Arr::get($request->getParsedBody(), 'data.attributes', []);

        return $this->strings->store($attributes);
    }
}
