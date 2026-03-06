<?php

namespace FoF\Linguist\Api\Controllers;

use FoF\Linguist\Repositories\StringRepository;
use Flarum\Api\Controller\AbstractDeleteController;
use Flarum\Http\RequestUtil;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;

class StringDeleteController extends AbstractDeleteController
{
    public function __construct(protected StringRepository $strings)
    {
    }

    protected function delete(ServerRequestInterface $request): void
    {
        RequestUtil::getActor($request)->assertAdmin();

        $id = Arr::get($request->getQueryParams(), 'id');

        $field = $this->strings->findOrFail($id);

        $this->strings->delete($field);
    }
}
