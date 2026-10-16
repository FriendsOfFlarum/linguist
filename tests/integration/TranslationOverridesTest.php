<?php

namespace FoF\Linguist\Tests\integration;

use Flarum\Extend\ExtenderInterface;
use Flarum\Extension\Extension;
use Flarum\Locale\LocaleManager;
use Flarum\Testing\integration\TestCase;
use FoF\Linguist\TextString;
use FoF\Linguist\Translator\RegisterStringLoader;
use Illuminate\Contracts\Container\Container;
use PHPUnit\Framework\Attributes\Test;

class TranslationOverridesTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        $this->extension('fof-linguist');

        // flarum/testing resolves LocaleManager while enabling extensions, before their
        // extenders run, so the afterResolving() hook in LoadStrings never fires in tests.
        // extend() also applies to an instance that has already been resolved.
        $this->extend(new class implements ExtenderInterface {
            public function extend(Container $container, ?Extension $extension = null): void
            {
                $container->extend(LocaleManager::class, function (LocaleManager $locales, Container $container) {
                    $container->make(RegisterStringLoader::class)($locales);

                    return $locales;
                });
            }
        });
    }

    protected function translate(string $key, array $parameters = []): string
    {
        return $this->app()->getContainer()->make('translator')->trans($key, $parameters);
    }

    #[Test]
    public function an_override_keeps_icu_placeholders_and_plurals_in_php(): void
    {
        $this->prepareDatabase([
            TextString::class => [
                [
                    'id' => 1,
                    'key' => 'core.lib.meta_titles.without_page_title',
                    'locale' => 'en',
                    'value' => '{pageNumber, plural, =1 {Welcome to {forumName}} other {{forumName}, page #}}',
                ],
            ],
        ]);

        $this->assertSame(
            'Welcome to Test Forum',
            $this->translate('core.lib.meta_titles.without_page_title', ['forumName' => 'Test Forum', 'pageNumber' => 1])
        );
        $this->assertSame(
            'Test Forum, page 2',
            $this->translate('core.lib.meta_titles.without_page_title', ['forumName' => 'Test Forum', 'pageNumber' => 2])
        );
    }

    #[Test]
    public function an_override_with_invalid_icu_syntax_is_served_as_written(): void
    {
        $this->prepareDatabase([
            TextString::class => [
                ['id' => 1, 'key' => 'core.forum.index.all_discussions_link', 'locale' => 'en', 'value' => 'All {discussions'],
            ],
        ]);

        $this->assertSame('All {discussions', $this->translate('core.forum.index.all_discussions_link'));
    }

    #[Test]
    public function a_locale_override_wins_over_an_all_locales_override(): void
    {
        $this->prepareDatabase([
            TextString::class => [
                ['id' => 1, 'key' => 'core.forum.index.all_discussions_link', 'locale' => 'en', 'value' => 'English only'],
                ['id' => 2, 'key' => 'core.forum.index.all_discussions_link', 'locale' => null, 'value' => 'Every language'],
            ],
        ]);

        $this->assertSame('English only', $this->translate('core.forum.index.all_discussions_link'));
    }
}
