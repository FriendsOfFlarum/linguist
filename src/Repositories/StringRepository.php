<?php

namespace Flagrow\Linguist\Repositories;

use Flagrow\Linguist\TextString;
use Flagrow\Linguist\Validators\StringValidator;

class StringRepository
{
    /**
     * @var TextString
     */
    protected $textString;

    /**
     * @var StringValidator
     */
    protected $validator;

    public function __construct(TextString $textString, StringValidator $validator)
    {
        $this->textString = $textString;
        $this->validator = $validator;
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
     * @return TextString
     */
    public function findOrFail($id)
    {
        return $this->query()->findOrFail($id);
    }

    /**
     * @param array $attributes
     * @return TextString
     */
    public function store(array $attributes)
    {
        $this->validator->assertValid($attributes);

        $string = new TextString($attributes);
        $string->save();

        return $string;
    }

    /**
     * @param TextString $string
     * @param array $attributes
     * @return TextString
     */
    public function update(TextString $string, array $attributes)
    {
        $this->validator->assertValid($attributes);

        $string->fill($attributes);
        $string->save();

        return $string;
    }

    /**
     * @param TextString $string
     */
    public function delete(TextString $string)
    {
        $string->delete();
    }

}
