<?php

namespace Flagrow\Linguist\Api\Serializers;

use Flarum\Api\Serializer\AbstractSerializer;

class StringKeySerializer extends AbstractSerializer
{
    public function getType($model)
    {
        return 'flagrow-linguist-string-key';
    }

    public function getId($model)
    {
        return array_get($model, 'key');
    }

    protected function getDefaultAttributes($model)
    {
        return $model;
    }
}
