<?php

namespace FoF\Linguist\Api\Serializers;

use Flarum\Api\Serializer\AbstractSerializer;
use Illuminate\Support\Arr;

class StringKeySerializer extends AbstractSerializer
{
    public function getType($model): string
    {
        return 'fof-linguist-string-key';
    }

    public function getId($model): string
    {
        return Arr::get($model, 'key');
    }

    protected function getDefaultAttributes($model): array
    {
        return $model;
    }
}
