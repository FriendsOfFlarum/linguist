<?php

namespace FoF\Linguist\Tests\integration\api;

use Flarum\Testing\integration\TestCase;
use FoF\Linguist\TextString;
use PHPUnit\Framework\Attributes\Test;
use Psr\Http\Message\ResponseInterface;

class UpdateTextStringTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        $this->extension('fof-linguist');

        $this->prepareDatabase([
            TextString::class => [
                ['id' => 1, 'key' => 'core.forum.index.all_discussions_link', 'locale' => 'en', 'value' => 'Everything'],
            ],
        ]);
    }

    protected function update(array $attributes): ResponseInterface
    {
        return $this->send(
            $this->request('PATCH', '/api/fof-linguist-strings/1', [
                'authenticatedAs' => 1,
                'json' => [
                    'data' => [
                        'type' => 'fof-linguist-strings',
                        'id' => '1',
                        'attributes' => $attributes,
                    ],
                ],
            ])
        );
    }

    #[Test]
    public function the_locale_of_a_saved_translation_cannot_be_changed(): void
    {
        $response = $this->update([
            'key' => 'core.forum.index.all_discussions_link',
            'locale' => 'de',
            'value' => 'Alles',
        ]);

        $this->assertSame(422, $response->getStatusCode());
        $this->assertSame('en', TextString::query()->find(1)->locale);
    }

    #[Test]
    public function the_value_can_be_changed_when_the_key_and_locale_are_sent_unchanged(): void
    {
        // The admin page sends every attribute when it saves a translation
        $response = $this->update([
            'key' => 'core.forum.index.all_discussions_link',
            'locale' => 'en',
            'value' => 'All of it',
        ]);

        $this->assertSame(200, $response->getStatusCode());
        $this->assertSame('All of it', TextString::query()->find(1)->value);
    }
}
