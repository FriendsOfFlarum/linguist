<?php

namespace FoF\Linguist\Tests\integration\api;

use Flarum\Locale\LocaleManager;
use Flarum\Testing\integration\TestCase;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\Test;

class CreateTextStringTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        $this->extension('fof-linguist');
    }

    protected function create(string $value, ?string $locale = 'en'): \Psr\Http\Message\ResponseInterface
    {
        return $this->send(
            $this->request('POST', '/api/fof-linguist-strings', [
                'authenticatedAs' => 1,
                'json' => [
                    'data' => [
                        'type' => 'fof-linguist-strings',
                        'attributes' => [
                            'key' => 'core.forum.index.all_discussions_link',
                            'locale' => $locale,
                            'value' => $value,
                        ],
                    ],
                ],
            ])
        );
    }

    /**
     * @return array<int, array{locale: string|null, value: string}>
     */
    protected function savedStrings(): array
    {
        $response = $this->send($this->request('GET', '/api/fof-linguist-strings', ['authenticatedAs' => 1]));

        return array_map(
            fn (array $string) => ['locale' => $string['attributes']['locale'], 'value' => $string['attributes']['value']],
            json_decode((string) $response->getBody(), true)['data']
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

    #[Test]
    public function saving_a_translation_marks_compiled_translations_as_stale(): void
    {
        // Flarum rebuilds a compiled catalogue when the locale revision no longer matches the one it was built with
        $locales = $this->app()->getContainer()->make(LocaleManager::class);
        $revision = $locales->revision();

        $response = $this->create('Every discussion');

        $this->assertSame(201, $response->getStatusCode());
        $this->assertNotSame($revision, $locales->revision());
    }

    public static function locales(): array
    {
        return [
            'all locales' => [null],
            'one locale' => ['en'],
        ];
    }

    #[Test]
    #[DataProvider('locales')]
    public function saving_the_same_key_and_locale_again_updates_the_existing_translation(?string $locale): void
    {
        $this->create('First', $locale);

        $response = $this->create('Second', $locale);

        $this->assertSame(201, $response->getStatusCode());
        $this->assertSame([['locale' => $locale, 'value' => 'Second']], $this->savedStrings());
    }
}
