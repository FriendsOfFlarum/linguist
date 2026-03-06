<?php

namespace FoF\Linguist\Translator;

use Symfony\Component\Config\ConfigCacheInterface;
use Symfony\Component\Config\Resource\ResourceInterface;

class NoOpConfigCache implements ConfigCacheInterface
{
    public function getPath(): string
    {
        return '';
    }

    /**
     * Checks if the cache is still fresh.
     *
     * This check should take the metadata passed to the write() method into consideration.
     *
     * @return bool Whether the cache is still fresh
     */
    public function isFresh(): bool
    {
        return false;
    }

    /**
     * Writes the given content into the cache file. Metadata will be stored
     * independently and can be used to check cache freshness at a later time.
     *
     * @param string $content The content to write into the cache
     * @param ResourceInterface[]|null $metadata An array of ResourceInterface instances
     *
     * @throws \RuntimeException When the cache file cannot be written
     */
    public function write(string $content, ?array $metadata = null): void
    {
        // No op
    }
}
