<?php

namespace FoF\Linguist\Api\Serializers;

use Flarum\Api\Serializer\AbstractSerializer;
use Illuminate\Support\Arr;

class StringKeySerializer extends AbstractSerializer
{
    public function getType($model)
    {
        return 'fof-linguist-string-key';
    }

    public function getId($model)
    {
        return Arr::get($model, 'key');
    }

    protected function getDefaultAttributes($model)
    {
        return $model;
    }
}
