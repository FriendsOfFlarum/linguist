<?php

namespace Flagrow\Linguist\Api\Serializers;

use Flarum\Api\Serializer\AbstractSerializer;
use Illuminate\Support\Arr;

class DefaultStringSerializer extends AbstractSerializer
{
    public function getType($model)
    {
        return 'flagrow-linguist-default-string';
    }

    public function getId($model)
    {
        return Arr::get($model, 'locale') . '.' . Arr::get($model, 'key');
    }

    protected function getDefaultAttributes($model)
    {
        return $model;
    }
}
