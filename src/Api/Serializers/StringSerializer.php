<?php

namespace FoF\Linguist\Api\Serializers;

use Flarum\Api\Serializer\AbstractSerializer;

class StringSerializer extends AbstractSerializer
{
    public function getType($model): string
    {
        return 'fof-linguist-string';
    }

    /**
     * @param \FoF\Linguist\TextString $model
     * @return array
     */
    protected function getDefaultAttributes($model): array
    {
        return $model->toArray();
    }
}
