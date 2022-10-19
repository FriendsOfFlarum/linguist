<?php

namespace FoF\Linguist\Repositories;

use FoF\Linguist\TextString;
use FoF\Linguist\Validators\StringValidator;
use Illuminate\Database\Eloquent\Model;

class StringRepository
{
    protected $textString;
    protected $validator;
    protected $cacheStatus;

    public function __construct(TextString $textString, StringValidator $validator, CacheStatusRepository $cacheStatus)
    {
        $this->textString = $textString;
        $this->validator = $validator;
        $this->cacheStatus = $cacheStatus;
    }

    protected function query()
    {
        return $this->textString->newQuery()->orderBy('key')->orderBy('locale');
    }

    public function stringsForLocale($locale)
    {
        return $this->query()->where('locale', $locale)->orWhere('locale', null)->get();
    }

    public function all()
    {
        return $this->query()->get();
    }

    /**
     * @param $id
     * @return TextString|Model
     */
    public function findOrFail($id)
    {
        return $this->query()->findOrFail($id);
    }

    /**
     * @param $key
     */
    public function getByKey($key)
    {
        return $this->query()->where('key', $key)->get();
    }

    /**
     * @param array $attributes
     * @return TextString
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(array $attributes)
    {
        $this->validator->assertValid($attributes);

        $string = new TextString($attributes);
        $string->save();

        $this->cacheStatus->translationWasModified($string->locale);

        return $string;
    }

    /**
     * @param TextString $string
     * @param array $attributes
     * @return TextString
     * @throws \Illuminate\Validation\ValidationException
     */
    public function update(TextString $string, array $attributes)
    {
        $this->validator->assertValid($attributes);

        $string->fill($attributes);
        $string->save();

        $this->cacheStatus->translationWasModified($string->locale);

        return $string;
    }

    /**
     * @param TextString $string
     * @throws \Exception
     */
    public function delete(TextString $string)
    {
        $string->delete();

        $this->cacheStatus->translationWasModified($string->locale);
    }
}
