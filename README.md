# Linguist by FriendsOfFlarum

[![MIT license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/FriendsOfFlarum/linguist/blob/master/LICENSE.md) [![Latest Stable Version](https://img.shields.io/packagist/v/fof/linguist.svg)](https://packagist.org/packages/fof/linguist) [![Total Downloads](https://img.shields.io/packagist/dt/fof/linguist.svg)](https://packagist.org/packages/fof/linguist)

With this extension you can configure alternate or missing translation strings for your forum. Includes:

- No manual translation file editing required, everything is configured via the admin UI
- Translate frontend or backend strings
- Override the translation for a specific locale or all installed locales
- Easily search for strings by name or value in any language
- Multiple filters to find strings that are missing translations or belong to a specific extension

After editing translations, Linguist will offer you the opportunity to clear the forum cache.
For performance reasons, Linguist won't attempt to clear the cache by itself.

If the new translations don't show up, try clearing the cache again by using *Dashboard > Tools > Clear cache* or by running `php flarum cache:clear`.

Also note Flarum uses a ["one place, one translation key"](https://flarum.org/docs/extend/i18n.html) approach to translations, so you might have to edit several keys to replace a specific keyword.

## Installation

```sh
composer require fof/linguist
```

## Updating

```sh
composer require fof/linguist
php flarum migrate
php flarum cache:clear
```

### Updating from Flagrow

This extension replaces [Flagrow Linguist](https://packagist.org/packages/flagrow/linguist).

To upgrade from the old extension to the new one:

- Disable the Linguist extension in the admin panel.

- Run:

```sh
composer require fof/linguist
```

Composer should let you know that `flagrow/linguist` has been automatically removed.

- Enable the new extension in the admin panel.

- Your existing translations will be migrated to FoF Linguist automatically.

- Edit a translation or clear the cache to apply the existing translations to the forum.

## Configuration

Once enabled, a new tab will show up in the admin to configure translations.

The tab will list all translations strings registered by extensions on your forum.
You can customize the text by entering your own value in the field.

A special field "all" allows you to define a single text that will be shown in all languages.

Keep in mind some strings contain references in the form `{referencename}` that you have to keep identical if you want the data to show up.

## Links

- [Flarum Discuss post](https://discuss.flarum.org/d/7026)
- [Source code on GitHub](https://github.com/FriendsOfFlarum/linguist)
- [Report an issue](https://github.com/FriendsOfFlarum/linguist/issues)
- [Download via Packagist](https://packagist.org/packages/fof/linguist)

An extension by [FriendsOfFlarum](https://github.com/FriendsOfFlarum)
