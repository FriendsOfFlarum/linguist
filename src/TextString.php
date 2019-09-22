<?php

namespace FoF\Linguist;

use Carbon\Carbon;
use Flarum\Database\AbstractModel;

/**
 * @property int $id
 * @property string $key
 * @property string $locale
 * @property string $value
 * @property Carbon $created_at
 * @property Carbon $updated_at
 */
class TextString extends AbstractModel
{
    public $timestamps = true;

    protected $table = 'fof_linguist_strings';

    protected $visible = [
        'key',
        'locale',
        'value',
    ];

    protected $fillable = [
        'key',
        'locale',
        'value',
    ];
}
