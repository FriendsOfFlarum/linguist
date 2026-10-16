<?php

namespace FoF\Linguist\Api\Resource;

use Flarum\Api\Context;
use Flarum\Api\Endpoint;
use Flarum\Api\Resource\AbstractDatabaseResource;
use Closure;
use Flarum\Api\Schema;
use Flarum\Foundation\ValidationException;
use Flarum\Locale\TranslatorInterface;
use FoF\Linguist\Repositories\CacheStatusRepository;
use FoF\Linguist\TextString;
use FoF\Linguist\Translator\IcuSyntax;
use Illuminate\Database\Eloquent\Builder;
use Tobyz\JsonApiServer\Context as BaseContext;

/**
 * @extends AbstractDatabaseResource<TextString>
 */
class TextStringResource extends AbstractDatabaseResource
{
    public function __construct(
        protected CacheStatusRepository $cacheStatus,
        protected TranslatorInterface $translator,
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
                    $this->cacheStatus->translationWasModified();

                    return $model;
                }),

            Endpoint\Update::make()
                ->authenticated()
                ->before(function (Context $context) {
                    $context->getActor()->assertAdmin();
                })
                ->after(function (Context $context, TextString $model) {
                    $this->cacheStatus->translationWasModified();

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
                ->writable()
                // A callable passed to rule() is called with the context to build the rule
                ->rule(fn () => function (string $attribute, mixed $value, Closure $fail) {
                    if (is_string($value) && !IcuSyntax::isValid($value)) {
                        $fail($this->translator->trans('fof-linguist.api.invalid_icu_syntax'));
                    }
                }),
        ];
    }

    public function sorts(): array
    {
        return [];
    }

    public function creating(object $model, BaseContext $context): ?object
    {
        /** @var TextString $model */
        // The unique index does not stop two "All locales" rows, whose locale is null,
        // so saving a key and locale that already exist updates that translation instead
        $existing = TextString::query()
            ->where('key', $model->key)
            ->where('locale', $model->locale)
            ->first();

        if ($existing) {
            $existing->value = $model->value;

            return $existing;
        }

        return $model;
    }

    public function updating(object $model, BaseContext $context): ?object
    {
        // The admin page sends the key and locale with every save, so only an actual change is rejected
        if ($model instanceof TextString && $model->isDirty(['key', 'locale'])) {
            throw new ValidationException([
                ($model->isDirty('key') ? 'key' : 'locale') => $this->translator->trans('fof-linguist.api.cannot_change_key_or_locale'),
            ]);
        }

        return $model;
    }

    public function delete(object $model, BaseContext $context): void
    {
        /** @var TextString $model */
        $model->delete();

        $this->cacheStatus->translationWasModified();
    }
}
