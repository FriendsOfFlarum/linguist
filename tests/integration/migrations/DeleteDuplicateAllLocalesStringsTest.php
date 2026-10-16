<?php

namespace FoF\Linguist\Tests\integration\migrations;

use Flarum\Testing\integration\TestCase;
use FoF\Linguist\TextString;
use PHPUnit\Framework\Attributes\Test;

class DeleteDuplicateAllLocalesStringsTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        $this->extension('fof-linguist');
    }

    #[Test]
    public function only_the_most_recently_saved_all_locales_row_of_a_key_is_kept(): void
    {
        $this->prepareDatabase([
            TextString::class => [
                ['id' => 1, 'key' => 'core.forum.index.all_discussions_link', 'locale' => null, 'value' => 'Oldest', 'updated_at' => '2026-01-01 00:00:00'],
                ['id' => 2, 'key' => 'core.forum.index.all_discussions_link', 'locale' => null, 'value' => 'Newest', 'updated_at' => '2026-03-01 00:00:00'],
                ['id' => 3, 'key' => 'core.forum.index.all_discussions_link', 'locale' => null, 'value' => 'Never saved', 'updated_at' => null],
                ['id' => 4, 'key' => 'core.forum.index.all_discussions_link', 'locale' => 'en', 'value' => 'English'],
                ['id' => 5, 'key' => 'core.forum.index.start_discussion_button', 'locale' => null, 'value' => 'Only one'],
            ],
        ]);

        // Migrations run when the app boots, before the fixtures above exist
        $migration = require __DIR__.'/../../../migrations/2026_10_16_00_delete_duplicate_all_locales_strings.php';
        $migration['up']($this->database()->getSchemaBuilder());

        $this->assertSame([2, 4, 5], TextString::query()->orderBy('id')->pluck('id')->all());
    }
}
