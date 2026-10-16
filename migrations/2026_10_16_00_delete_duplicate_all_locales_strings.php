<?php

use Illuminate\Database\Schema\Builder;

// The unique index on key and locale does not apply to "All locales" rows, whose locale is null,
// so a key could end up with several of them. Only the most recently saved one is kept.
return [
    'up' => function (Builder $schema) {
        $db = $schema->getConnection();

        $keys = $db->table('fof_linguist_strings')
            ->whereNull('locale')
            ->groupBy('key')
            ->havingRaw('count(*) > 1')
            ->pluck('key');

        if ($keys->isEmpty()) {
            return;
        }

        $rows = $db->table('fof_linguist_strings')
            ->whereNull('locale')
            ->whereIn('key', $keys)
            ->get(['id', 'key', 'updated_at']);

        $deleteIds = [];

        foreach ($rows->groupBy('key') as $duplicates) {
            // Sorted here rather than in SQL, where databases disagree on where null dates go
            $keep = $duplicates->sortByDesc(fn ($row) => [(string) $row->updated_at, $row->id])->first();

            foreach ($duplicates as $row) {
                if ($row->id !== $keep->id) {
                    $deleteIds[] = $row->id;
                }
            }
        }

        $db->table('fof_linguist_strings')->whereIn('id', $deleteIds)->delete();
    },
    'down' => function (Builder $schema) {
        // The deleted duplicates cannot be restored
    },
];
