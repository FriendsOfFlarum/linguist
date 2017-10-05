<?php

namespace Flagrow\Linguist\Api\Controllers;

use Flagrow\Linguist\Api\Serializers\DefaultStringSerializer;
use Flarum\Api\Controller\AbstractCollectionController;
use Flarum\Core\Access\AssertPermissionTrait;
use Flarum\Locale\LocaleManager;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class DefaultStringIndexController extends AbstractCollectionController
{
    use AssertPermissionTrait;

    public $serializer = DefaultStringSerializer::class;

    /**
     * @var LocaleManager
     */
    protected $locales;

    public function __construct(LocaleManager $locales)
    {
        $this->locales = $locales;
    }

    protected function data(ServerRequestInterface $request, Document $document)
    {
        $this->assertAdmin($request->getAttribute('actor'));

        // Based on Flarum\Http\WebApp\AbstractWebApp
        $translations_raw = array_get($this->locales->getTranslator()->getMessages(), 'messages', []);

        $translations = collect($translations_raw)->map(function ($value, $key) {
            return [
                'key' => $key,
                'locale' => $this->locales->getLocale(),
                'value' => $value,
            ];
        });

        return $translations;
    }
}
