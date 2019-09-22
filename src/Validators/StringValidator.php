<?php

namespace FoF\Linguist\Validators;

use Flarum\Foundation\AbstractValidator;

class StringValidator extends AbstractValidator
{
    protected function getRules()
    {
        return [
            'key' => 'required|string',
            'locale' => 'sometimes|string',
            'value' => 'required|string',
        ];
    }
}
