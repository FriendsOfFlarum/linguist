<?php

namespace FoF\Linguist\Api\Serializers;

use Flarum\Api\Serializer\AbstractSerializer;

/**
 * @TODO: Remove this in favor of one of the API resource classes that were added.
 *      Or extend an existing API Resource to add this to.
 *      Or use a vanilla RequestHandlerInterface controller.
 *      @link https://docs.flarum.org/2.x/extend/api#endpoints
 */
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
