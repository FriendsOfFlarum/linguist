<?php

namespace FoF\Linguist\Api\Resource;

use Flarum\Api\Context;
use Flarum\Api\Endpoint;
use Flarum\Api\Resource\AbstractDatabaseResource;
use Flarum\Api\Schema;
use FoF\Linguist\Repositories\CacheStatusRepository;
use FoF\Linguist\TextString;
use Illuminate\Database\Eloquent\Builder;
use Tobyz\JsonApiServer\Context as BaseContext;

/**
 * @extends AbstractDatabaseResource<TextString>
 */
class TextStringResource extends AbstractDatabaseResource
{
    public function __construct(
        protected CacheStatusRepository $cacheStatus,
    ) {
    }

    public function type(): string
    {
        return 'fof-linguist-strings';
    }

    public function model(): string
    {
        return TextString::class;
    }

    public function scope(Builder $query, BaseContext $context): void
    {
        /** @var Context $context */
        $context->getActor()->assertAdmin();
    }

    public function endpoints(): array
    {
        return [
            Endpoint\Index::make()
                ->authenticated(),

            Endpoint\Show::make()
                ->authenticated(),

            Endpoint\Create::make()
                ->authenticated()
                ->before(function (Context $context) {
                    $context->getActor()->assertAdmin();
                })
                ->after(function (Context $context, TextString $model) {
                    $this->cacheStatus->translationWasModified($model->locale);

                    return $model;
                }),

            Endpoint\Update::make()
                ->authenticated()
                ->before(function (Context $context) {
                    $context->getActor()->assertAdmin();
                })
                ->after(function (Context $context, TextString $model) {
                    $this->cacheStatus->translationWasModified($model->locale);

                    return $model;
                }),

            Endpoint\Delete::make()
                ->authenticated()
                ->before(function (Context $context) {
                    $context->getActor()->assertAdmin();
                }),
        ];
    }

    public function fields(): array
    {
        return [
            Schema\Str::make('key')
                ->requiredOnCreate()
                ->writable(),

            Schema\Str::make('locale')
                ->nullable()
                ->writable(),

            Schema\Str::make('value')
                ->requiredOnCreate()
                ->writable(),
        ];
    }

    public function sorts(): array
    {
        return [];
    }

    public function delete(object $model, BaseContext $context): void
    {
        /** @var TextString $model */
        $model->delete();

        $this->cacheStatus->translationWasModified($model->locale);
    }
}
