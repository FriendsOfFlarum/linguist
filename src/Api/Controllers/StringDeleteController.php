<?php

namespace FoF\Linguist\Api\Controllers;

use FoF\Linguist\Repositories\StringRepository;
use Flarum\Api\Controller\AbstractDeleteController;
use Flarum\Http\RequestUtil;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;

class StringDeleteController extends AbstractDeleteController
{
    protected $strings;

    public function __construct(StringRepository $strings)
    {
        $this->strings = $strings;
    }

    protected function delete(ServerRequestInterface $request)
    {
        RequestUtil::getActor($request)->assertAdmin();

        $id = Arr::get($request->getQueryParams(), 'id');

        $field = $this->strings->findOrFail($id);

        $this->strings->delete($field);
    }
}
