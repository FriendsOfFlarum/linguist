<?php

namespace FoF\Linguist\Translator;

use Symfony\Component\Config\ConfigCacheFactoryInterface;
use Symfony\Component\Config\ConfigCacheInterface;

class NoOpConfigCacheFactory implements ConfigCacheFactoryInterface
{
    /**
     * Creates a cache instance and (re-)initializes it if necessary.
     *
     * @param string $file The absolute cache file path
     * @param callable $callable The callable to be executed when the cache needs to be filled (i. e. is not fresh). The cache will be passed as the only parameter to this callback
     *
     * @return ConfigCacheInterface The cache instance
     */
    public function cache($file, $callable)
    {
        $cache = new NoOpConfigCache();

        \call_user_func($callable, $cache);

        return $cache;
    }
}
