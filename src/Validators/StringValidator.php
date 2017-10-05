<?php

namespace Flagrow\Linguist\Validators;

use Flarum\Core\Validator\AbstractValidator;

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
