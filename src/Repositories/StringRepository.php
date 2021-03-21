<?php

namespace FoF\Linguist\Repositories;

use Flarum\Settings\SettingsRepositoryInterface;
use FoF\Linguist\TextString;
use FoF\Linguist\Validators\StringValidator;
use Illuminate\Database\Eloquent\Model;

class StringRepository
{
    protected $textString;
    protected $validator;
    protected $settings;

    public function __construct(TextString $textString, StringValidator $validator, SettingsRepositoryInterface $settings)
    {
        $this->textString = $textString;
        $this->validator = $validator;
        $this->settings = $settings;
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
     * @param array $attributes
     * @return TextString
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(array $attributes)
    {
        $this->validator->assertValid($attributes);

        $string = new TextString($attributes);
        $string->save();

        $this->cacheShouldBeCleared();

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

        $this->cacheShouldBeCleared();

        return $string;
    }

    /**
     * @param TextString $string
     * @throws \Exception
     */
    public function delete(TextString $string)
    {
        $string->delete();

        $this->cacheShouldBeCleared();
    }

    protected function cacheShouldBeCleared()
    {
        // This flags lets the frontend know it should suggest to the user to clear the cache
        $this->settings->set('fof.linguist.should-clear-cache', '1');
    }
}
