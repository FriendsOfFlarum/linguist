<?php

namespace FoF\Linguist\Tests\integration\api;

use Flarum\Testing\integration\TestCase;
use PHPUnit\Framework\Attributes\Test;
use Psr\Http\Message\ResponseInterface;

class ImportTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        $this->extension('fof-linguist');
    }

    protected function import(string $yaml, string $locale = 'en'): ResponseInterface
    {
        return $this->send(
            $this->request('POST', '/api/fof/linguist/import', [
                'authenticatedAs' => 1,
                'json' => [
                    'input' => $yaml,
                    'locale' => $locale,
                    'ignoreExisting' => false,
                ],
            ])
        );
    }

    /**
     * @return array<string, string>
     */
    protected function savedStrings(): array
    {
        $response = $this->send($this->request('GET', '/api/fof-linguist-strings', ['authenticatedAs' => 1]));

        $strings = [];

        foreach (json_decode((string) $response->getBody(), true)['data'] as $string) {
            $strings[$string['attributes']['key']] = $string['attributes']['value'];
        }

        return $strings;
    }

    #[Test]
    public function empty_entries_are_skipped_and_counted(): void
    {
        $response = $this->import(<<<'YAML'
            core:
                forum:
                    index:
                        all_discussions_link: Everything
                        start_discussion_button:
            YAML);

        $this->assertSame(200, $response->getStatusCode());

        $result = json_decode((string) $response->getBody(), true);
        $this->assertSame(1, $result['imported']);
        $this->assertSame(1, $result['empty']);

        $this->assertSame(['core.forum.index.all_discussions_link' => 'Everything'], $this->savedStrings());
    }

    #[Test]
    public function a_key_longer_than_180_characters_rejects_the_whole_import(): void
    {
        $longKey = 'vendor-extension.forum.'.str_repeat('a', 158);

        $response = $this->import(<<<YAML
            core.forum.index.all_discussions_link: Everything
            $longKey: Too long
            YAML);

        $this->assertSame(422, $response->getStatusCode());
        $this->assertSame([], $this->savedStrings());
    }
}
