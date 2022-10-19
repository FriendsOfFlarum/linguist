<?php

namespace FoF\Linguist\Translator;

use FoF\Linguist\Repositories\CacheStatusRepository;
use Symfony\Component\Config\Resource\SelfCheckingResourceInterface;

class DatabaseResource implements SelfCheckingResourceInterface
{
    protected $locale;

    public function __construct(string $locale)
    {
        $this->locale = $locale;
    }

    public function __toString(): string
    {
        // This is used as the resource identifier by the MessageCatalog
        // We don't need it because there will only be one of these for a given catalog
        return '';
    }

    public function isFresh(int $timestamp): bool
    {
        // Resolve status repository from container here so the translator doesn't try to serialize it including the database connection
        return $timestamp > resolve(CacheStatusRepository::class)->freshness($this->locale);
    }
}
