<?php

namespace FoF\Linguist\Api\Serializers;

use Flarum\Api\Serializer\AbstractSerializer;

class StringSerializer extends AbstractSerializer
{
    public function getType($model)
    {
        return 'fof-linguist-string';
    }

    protected function getDefaultAttributes($model)
    {
        return $model->toArray();
    }
}
