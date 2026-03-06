<?php

namespace FoF\Linguist\Api\Serializers;

use Flarum\Api\Serializer\AbstractSerializer;
use Illuminate\Support\Arr;

/**
 * @TODO: Remove this in favor of one of the API resource classes that were added.
 *      Or extend an existing API Resource to add this to.
 *      Or use a vanilla RequestHandlerInterface controller.
 *      @link https://docs.flarum.org/2.x/extend/api#endpoints
 */
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
