<?php

namespace FoF\Linguist\Translator;

use Symfony\Component\Config\ConfigCacheInterface;
use Symfony\Component\Config\Resource\ResourceInterface;

class NoOpConfigCache implements ConfigCacheInterface
{
    /**
     * Gets the cache file path.
     *
     * @return string The cache file path
     */
    public function getPath()
    {
        return null;
    }

    /**
     * Checks if the cache is still fresh.
     *
     * This check should take the metadata passed to the write() method into consideration.
     *
     * @return bool Whether the cache is still fresh
     */
    public function isFresh()
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
    public function write($content, array $metadata = null)
    {
        // No op
    }
}
