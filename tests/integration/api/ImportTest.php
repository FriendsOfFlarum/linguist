<?php

namespace FoF\Linguist\Tests\integration\api;

use Flarum\Testing\integration\TestCase;
use FoF\Linguist\TextString;
use PHPUnit\Framework\Attributes\DataProvider;
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

    public static function valuesThatAreNotText(): array
    {
        return [
            'empty list' => ['[]'],
            'boolean' => ['true'],
        ];
    }

    #[Test]
    #[DataProvider('valuesThatAreNotText')]
    public function a_value_that_is_not_text_rejects_the_whole_import(string $value): void
    {
        $response = $this->import(<<<YAML
            core.forum.index.all_discussions_link: Everything
            core.forum.index.start_discussion_button: $value
            YAML);

        $this->assertSame(422, $response->getStatusCode());
        $this->assertSame([], $this->savedStrings());
    }

    #[Test]
    public function a_value_with_invalid_icu_syntax_rejects_the_whole_import(): void
    {
        $response = $this->import(<<<'YAML'
            core.forum.index.all_discussions_link: Everything
            core.forum.index.start_discussion_button: "Start a {discussion"
            YAML);

        $this->assertSame(422, $response->getStatusCode());
        $this->assertSame([], $this->savedStrings());
    }

    #[Test]
    public function a_large_import_does_not_query_once_per_string(): void
    {
        // The test case fails the request when the same query repeats per string
        $yaml = '';

        foreach (range(1, 10) as $number) {
            $yaml .= "vendor-extension.forum.string_$number: String $number\n";
        }

        $response = $this->import($yaml);

        $this->assertSame(200, $response->getStatusCode());
        $this->assertSame(10, json_decode((string) $response->getBody(), true)['imported']);
    }

    #[Test]
    public function existing_translations_are_updated_unless_identical(): void
    {
        $this->prepareDatabase([
            TextString::class => [
                ['id' => 1, 'key' => 'core.forum.index.all_discussions_link', 'locale' => 'en', 'value' => 'Everything'],
                ['id' => 2, 'key' => 'core.forum.index.start_discussion_button', 'locale' => 'en', 'value' => 'Begin'],
            ],
        ]);

        $response = $this->import(<<<'YAML'
            core.forum.index.all_discussions_link: Everything
            core.forum.index.start_discussion_button: Start talking
            YAML);

        $result = json_decode((string) $response->getBody(), true);
        $this->assertSame(1, $result['imported']);
        $this->assertSame(1, $result['identical']);

        $this->assertSame([
            'core.forum.index.all_discussions_link' => 'Everything',
            'core.forum.index.start_discussion_button' => 'Start talking',
        ], $this->savedStrings());
    }
}
