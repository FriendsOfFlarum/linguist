import app from 'flarum/app';
import ExtensionPage from 'flarum/components/ExtensionPage';
import Button from 'flarum/components/Button';
import Dropdown from 'flarum/components/Dropdown';
import Select from 'flarum/components/Select';
import Alert from 'flarum/components/Alert';
import LoadingModal from 'flarum/components/LoadingModal';
import extractText from 'flarum/utils/extractText';
import isExtensionEnabled from 'flarum/utils/isExtensionEnabled';
import localesAsArray from '../utils/localesAsArray';
import StringKey from '../components/StringKey';

/* global m */

const RESULTS_PER_PAGE = 20;

export default class LinguistStringsPage extends ExtensionPage {
    oninit(vnode) {
        super.oninit(vnode);

        this.numberOfResultsToShow = RESULTS_PER_PAGE;

        this.filters = {
            search: '',
            withOwnTranslations: false,
            missingTranslationsNegation: 'without',
            missingTranslationsType: 'any',
            missingTranslationsInLocales: [],
            forExtension: null,
        };

        this.results = [];

        this.extensions = [];

        Promise.all([
            app.request({
                method: 'GET',
                url: app.forum.attribute('apiUrl') + '/fof/linguist/strings',
            }).then(result => {
                app.store.pushPayload(result);
            }),
            app.request({
                method: 'GET',
                url: app.forum.attribute('apiUrl') + '/fof/linguist/string-keys',
            }).then(result => {
                const keys = app.store.pushPayload(result);

                Object.keys(app.data.extensions).forEach(extensionId => {
                    const extension = app.data.extensions[extensionId];

                    // We don't show disabled extensions and language packs
                    if (!isExtensionEnabled(extensionId) || extension.extra.hasOwnProperty('flarum-locale')) {
                        return;
                    }

                    this.extensions.push({
                        extension,
                        // canBeTranslated means translations exist with that extension's ID as prefix
                        canBeTranslated: keys.findIndex(key => key.key().indexOf(extensionId + '.') === 0) !== -1,
                    });
                });
            }),
        ]).then(() => {
            this.applyFilters();
        });
    }

    content() {
        const keys = this.results.slice(0, this.numberOfResultsToShow);

        return m('.container', [
            // Additional divs are used to reduce Mithril redraws as much as possible when the conditional components appear
            m('div', app.data.settings['fof.linguist.should-clear-cache'] === '1' ? Alert.component({
                dismissible: false,
                controls: [Button.component({
                    className: 'Button Button--link',
                    onclick() {
                        // Same logic as in core StatusWidget
                        app.modal.show(LoadingModal);

                        app.request({
                            method: 'DELETE',
                            url: app.forum.attribute('apiUrl') + '/cache',
                        }).then(() => window.location.reload());
                    },
                }, app.translator.trans('fof-linguist.admin.clear-cache.button'))],
            }, app.translator.trans('fof-linguist.admin.clear-cache.text')) : null),
            m('.FoF-Linguist-Filters', [
                m('input.FormControl', {
                    value: this.filters.search,
                    oninput: event => {
                        this.filters.search = event.target.value;
                        this.applyFilters();
                    },
                    placeholder: app.translator.trans('fof-linguist.admin.filters.search'),
                }),
                Button.component({
                    className: 'Button' + (this.filters.withOwnTranslations ? ' FoF-Linguist-Filter--Selected' : ''),
                    icon: `far fa-${this.filters.withOwnTranslations ? 'check-square' : 'square'}`,
                    onclick: () => {
                        this.filters.withOwnTranslations = !this.filters.withOwnTranslations;
                        this.applyFilters();
                    },
                }, app.translator.trans('fof-linguist.admin.filters.with-own-translations')),
                Dropdown.component({
                    buttonClassName: 'Button' + (this.filters.forExtension ? ' FoF-Linguist-Filter--Selected' : ''),
                    label: app.translator.trans('fof-linguist.admin.filters.for-extension'),
                }, this.extensions.map(
                    extensionData => Button.component({
                        className: 'Button' + (extensionData.canBeTranslated ? '' : ' disabled'),
                        icon: `far fa-${this.filters.forExtension === extensionData.extension.id ? 'check-square' : 'square'}`,
                        onclick: event => {
                            if (!extensionData.canBeTranslated) {
                                event.stopPropagation();

                                // Provide an explanation why some extensions might not be offered for translation
                                alert(extractText(app.translator.trans('fof-linguist.admin.filters.for-extension-unavailable', {
                                    namespace: extensionData.extension.id,
                                })));

                                return;
                            }

                            if (this.filters.forExtension === extensionData.extension.id) {
                                this.filters.forExtension = null;
                            } else {
                                this.filters.forExtension = extensionData.extension.id;
                            }

                            this.applyFilters();
                        },
                    }, extensionData.extension.extra['flarum-extension'].title)
                )),
                Dropdown.component({
                    buttonClassName: 'Button' + (this.filters.missingTranslationsInLocale ? ' FoF-Linguist-Filter--Selected' : ''),
                    label: app.translator.trans('fof-linguist.admin.filters.missing'),
                }, [
                    m('.FoF-Linguist-Missing-Filter', {
                        onclick(event) {
                            // Prevent closing the dropdown
                            event.stopPropagation();
                        },
                    }, [
                        Select.component({
                            value: this.filters.missingTranslationsNegation,
                            onchange: value => {
                                this.filters.missingTranslationsNegation = value;

                                if (this.filters.missingTranslationsInLocale) {
                                    this.applyFilters();
                                }
                            },
                            options: {
                                without: app.translator.trans('fof-linguist.admin.filters.negation-options.without'),
                                with: app.translator.trans('fof-linguist.admin.filters.negation-options.with'),
                            }
                        }),
                        Select.component({
                            value: this.filters.missingTranslationsType,
                            onchange: value => {
                                this.filters.missingTranslationsType = value;

                                if (this.filters.missingTranslationsInLocale) {
                                    this.applyFilters();
                                }
                            },
                            options: {
                                any: app.translator.trans('fof-linguist.admin.filters.type-options.any'),
                                original: app.translator.trans('fof-linguist.admin.filters.type-options.original'),
                                own: app.translator.trans('fof-linguist.admin.filters.type-options.own'),
                            }
                        }),
                        m('p', app.translator.trans('fof-linguist.admin.filters.missing-middle-label')),
                    ]),
                    ...localesAsArray().map(
                        locale => Button.component({
                            className: 'Button',
                            icon: `far fa-${this.filters.missingTranslationsInLocale === locale.key ? 'check-square' : 'square'}`,
                            onclick: () => {
                                if (this.filters.missingTranslationsInLocale === locale.key) {
                                    this.filters.missingTranslationsInLocale = null
                                } else {
                                    this.filters.missingTranslationsInLocale = locale.key;
                                }

                                this.applyFilters();
                            },
                        }, locale.name + ' (' + locale.key + ')')
                    ),
                ]),
            ]),
            m('div', keys.map(stringKey => m(StringKey, {
                key: stringKey.id(),
                stringKey,
                highlight: this.filters.search,
                onchange: () => {
                    // We use the setting and not a local variable because we need to preserve state
                    // if we navigate away and back to the Linguist page without refreshing the admin panel
                    app.data.settings['fof.linguist.should-clear-cache'] = '1';
                },
            }))),
            m('.FoF-Linguist-Results', [
                app.translator.trans('fof-linguist.admin.filters.results', {
                    shown: keys.length + '', // cast to string otherwise number isn't displayed
                    total: this.results.length + '',
                }),
                ' ',
                (this.results.length > keys.length ? Button.component({
                    className: 'Button',
                    onclick: () => {
                        this.numberOfResultsToShow += RESULTS_PER_PAGE;
                    },
                }, app.translator.trans('fof-linguist.admin.buttons.load-more')) : null),
            ]),
        ]);
    }

    applyFilters() {
        this.numberOfResultsToShow = RESULTS_PER_PAGE;

        const keysWithCustomTranslations = app.store.all('fof-linguist-string').map(string => string.key());

        const keysWithCustomTranslationsIn = {};
        localesAsArray().forEach(locale => {
            keysWithCustomTranslationsIn[locale.key] = app.store.all('fof-linguist-string')
                .filter(string => string.locale() === locale.key)
                .map(string => string.key());
        });

        let lowercaseSearch = '';

        if (this.filters.search) {
            lowercaseSearch = this.filters.search.toLowerCase();
        }

        this.results = app.store.all('fof-linguist-string-key').filter(key => {
            if (this.filters.withOwnTranslations && keysWithCustomTranslations.indexOf(key.key()) === -1) {
                return false;
            }

            if (this.filters.missingTranslationsInLocale) {
                let hasOriginalTranslation = key.locales().hasOwnProperty(this.filters.missingTranslationsInLocale);
                let hasOwnTranslation = keysWithCustomTranslationsIn[this.filters.missingTranslationsInLocale].indexOf(key.key()) !== -1;

                let matchesType = false;

                switch (this.filters.missingTranslationsType) {
                    case 'any':
                        matchesType = hasOriginalTranslation || hasOwnTranslation;
                        break;
                    case 'original':
                        matchesType = hasOriginalTranslation;
                        break;
                    case 'own':
                        matchesType = hasOwnTranslation;
                        break;
                }

                if (this.filters.missingTranslationsNegation === 'without') {
                    matchesType = !matchesType;
                }

                if (!matchesType) {
                    return false;
                }
            }

            if (this.filters.forExtension) {
                if (key.key().indexOf(this.filters.forExtension + '.') !== 0) {
                    return false;
                }
            }

            if (lowercaseSearch) {
                if (key.key().toLowerCase().indexOf(lowercaseSearch) !== -1) {
                    return true;
                }

                const locales = key.locales();

                for (let locale in locales) {
                    if (locales.hasOwnProperty(locale) && locales[locale].toLowerCase().indexOf(lowercaseSearch) !== -1) {
                        return true;
                    }
                }

                return false;
            }

            return true;
        });

        m.redraw();
    }
}
