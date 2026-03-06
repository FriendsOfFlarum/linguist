<?php

namespace FoF\Linguist\Repositories;

use Flarum\Database\Eloquent\Collection;
use FoF\Linguist\TextString;
use Illuminate\Database\Eloquent\Builder;

class StringRepository
{
    public function __construct(protected TextString $textString)
    {
    }

    /**
     * @return Builder<TextString>
     */
    protected function query(): Builder
    {
        return $this->textString->newQuery()->orderBy('key')->orderBy('locale');
    }

    /**
     * @return Collection<int, TextString>
     */
    public function stringsForLocale(?string $locale): Collection
    {
        return $this->query()->where('locale', $locale)->orWhere('locale', null)->get();
    }

    /**
     * @return Collection<int, TextString>
     */
    public function all(): Collection
    {
        return $this->query()->get();
    }

    public function findOrFail(int|string $id): TextString
    {
        return $this->query()->findOrFail($id);
    }

    /**
     * @return Collection<int, TextString>
     */
    public function getByKey(string $key): Collection
    {
        return $this->query()->where('key', $key)->get();
    }

    /**
     * @param array<string> $keys
     * @return Collection<int, TextString>
     */
    public function getByKeys(array $keys): Collection
    {
        return $this->query()->whereIn('key', $keys)->get();
    }
}
