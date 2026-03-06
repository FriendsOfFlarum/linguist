<?php

namespace FoF\Linguist\Api\Resource;

use Flarum\Api\Context;
use Flarum\Api\Endpoint;
use Flarum\Api\Resource\AbstractResource;
use Flarum\Api\Resource\Contracts\Findable;
use Flarum\Api\Resource\Contracts\Listable;
use Flarum\Api\Schema;
use FoF\Linguist\Repositories\DefaultStringsRepository;
use Illuminate\Support\Arr;
use Tobyz\JsonApiServer\Context as BaseContext;

/**
 * @extends AbstractResource<object>
 */
class StringKeyResource extends AbstractResource implements Listable, Findable
{
    public function __construct(
        protected DefaultStringsRepository $repository,
    ) {
    }

    public function type(): string
    {
        return 'fof-linguist-string-keys';
    }

    public function getId(object $model, BaseContext $context): string
    {
        return $model->key;
    }

    public function endpoints(): array
    {
        return [
            Endpoint\Index::make()
                ->authenticated()
                ->before(function (Context $context) {
                    $context->getActor()->assertCan('viewStringKeys');
                }),

            Endpoint\Show::make()
                ->authenticated()
                ->before(function (Context $context) {
                    $context->getActor()->assertCan('viewStringKeys');
                }),
        ];
    }

    public function fields(): array
    {
        return [
            Schema\Str::make('key')
                ->get(fn (object $model) => $model->key),

            Schema\Attribute::make('locales')
                ->get(fn (object $model) => $model->locales),
        ];
    }

    public function sorts(): array
    {
        return [];
    }

    public function query(BaseContext $context): object
    {
        /** @var Context $context */
        $filters = $context->queryParam('filter', []);
        $prefix = is_array($filters) ? Arr::get($filters, 'prefix') : null;

        return (object) [
            'prefix' => $prefix,
        ];
    }

    public function results(object $query, BaseContext $context): iterable
    {
        return $this->repository->allTranslations($query->prefix)
            ->map(fn (array $item) => (object) $item)
            ->values()
            ->all();
    }

    public function find(string $id, BaseContext $context): ?object
    {
        /** @var Context $context */
        $context->getActor()->assertCan('viewStringKeys');

        $translation = $this->repository->getTranslation($id);

        return (object) $translation;
    }
}
