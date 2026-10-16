<?php

namespace FoF\Linguist\Tests\integration\api;

use Flarum\Testing\integration\TestCase;
use PHPUnit\Framework\Attributes\Test;

class CreateTextStringTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        $this->extension('fof-linguist');
    }

    protected function create(string $value): \Psr\Http\Message\ResponseInterface
    {
        return $this->send(
            $this->request('POST', '/api/fof-linguist-strings', [
                'authenticatedAs' => 1,
                'json' => [
                    'data' => [
                        'type' => 'fof-linguist-strings',
                        'attributes' => [
                            'key' => 'core.forum.index.all_discussions_link',
                            'locale' => 'en',
                            'value' => $value,
                        ],
                    ],
                ],
            ])
        );
    }

    #[Test]
    public function a_value_with_invalid_icu_syntax_is_rejected(): void
    {
        $response = $this->create('All {discussions');

        $this->assertSame(422, $response->getStatusCode());

        $errors = json_decode((string) $response->getBody(), true)['errors'];
        $this->assertSame('/data/attributes/value', $errors[0]['source']['pointer']);
    }

    #[Test]
    public function a_value_with_valid_icu_syntax_is_saved(): void
    {
        $response = $this->create("{count, plural, one {Today's discussion} other {# discussions}}");

        $this->assertSame(201, $response->getStatusCode());
    }
}
