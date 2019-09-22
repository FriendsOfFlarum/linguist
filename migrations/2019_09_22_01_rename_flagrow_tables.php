<?php

use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        // Re-use the tables from the Flagrow version if they exist
        if ($schema->hasTable('flagrow_linguist_strings') && !$schema->hasTable('fof_linguist_strings')) {
            $schema->rename('flagrow_linguist_strings', 'fof_linguist_strings');
        }
    },
    'down' => function (Builder $schema) {
        // Not doing anything but `down` has to be defined
    },
];
