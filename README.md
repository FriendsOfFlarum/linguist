# Linguist by ![Flagrow logo](https://avatars0.githubusercontent.com/u/16413865?v=3&s=20) [Flagrow](https://discuss.flarum.org/d/1832-flagrow-extension-developer-group), a project of [Gravure](https://gravure.io/)

[![MIT license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/flagrow/linguist/blob/master/LICENSE.md) [![Latest Stable Version](https://img.shields.io/packagist/v/flagrow/linguist.svg)](https://packagist.org/packages/flagrow/linguist) [![Total Downloads](https://img.shields.io/packagist/dt/flagrow/linguist.svg)](https://packagist.org/packages/flagrow/linguist) [![Donate](https://img.shields.io/badge/patreon-support-yellow.svg)](https://www.patreon.com/flagrow) [![Join our Discord server](https://discordapp.com/api/guilds/240489109041315840/embed.png)](https://flagrow.io/join-discord)

With this extension you can configure alternate or missing translation strings for your forum. Includes:

- No manual translation file editing required, everything is configured via the admin UI
- Translate frontend or backend strings
- Override the translation for a specific locale or all installed locales
- Autocomplete of translation keys so you don't have to remember them

Don't forget to run `php flarum cache:clear` if the new translations don't show up.

Also note Flarum uses a ["one place, one translation key"](http://flarum.org/docs/extend/internationalize/) approach to translations, so you might have to edit several keys to replace a specific keyword.

## Installation

Use [Bazaar](https://discuss.flarum.org/d/5151-flagrow-bazaar-the-extension-marketplace) or install manually:

```bash
composer require flagrow/linguist
```

## Updating

```bash
composer update flagrow/linguist
php flarum migrate
php flarum cache:clear
```

## Configuration

Once enabled, a new tab will show up in the admin to configure translations.

- The translation key fields is autocompleted with the list of currently loaded translations.
- The locale setting is also autocompleted with all currently enabled locales.
- The value field contains the text you want to show instead of the default one. Keep in mind some strings contain variables in the form `{variablename}` that you have to keep identical if you want the data to show up.

## Support our work

We prefer to keep our work available to everyone.
In order to do so we rely on voluntary contributions on [Patreon](https://www.patreon.com/flagrow).

## Security

If you discover a security vulnerability within Linguist, please send an email to the Gravure team at security@gravure.io. All security vulnerabilities will be promptly addressed.

Please include as many details as possible. You can use `php flarum info` to get the PHP, Flarum and extension versions installed.

## Links

- [Flarum Discuss post](https://discuss.flarum.org/d/7026-flagrow-linguist-customize-translations-with-ease)
- [Source code on GitHub](https://github.com/flagrow/linguist)
- [Report an issue](https://github.com/flagrow/linguist/issues)
- [Download via Packagist](https://packagist.org/packages/flagrow/linguist)

An extension by [Flagrow](https://flagrow.io/), a project of [Gravure](https://gravure.io/).
