<?php

namespace Flagrow\Linguist\Api\Serializers;

use Flarum\Api\Serializer\AbstractSerializer;

class StringSerializer extends AbstractSerializer
{
    public function getType($model)
    {
        return 'flagrow-linguist-string';
    }

    protected function getDefaultAttributes($model)
    {
        return $model->toArray();
    }
}
