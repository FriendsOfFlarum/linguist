import app from 'flarum/app';
import Page from 'flarum/components/Page';
import Button from 'flarum/components/Button';
import Dropdown from 'flarum/components/Dropdown';
import ExtensionsPage from 'flarum/components/ExtensionsPage';
import Alert from 'flarum/components/Alert';
import LoadingModal from 'flarum/components/LoadingModal';
import extractText from 'flarum/utils/extractText';
import localesAsArray from '../utils/localesAsArray';
import StringKey from '../components/StringKey';

/* global m */

const RESULTS_PER_PAGE = 20;

export default class LinguistStringsPage extends Page {
    oninit(vnode) {
        super.oninit(vnode);

        this.numberOfResultsToShow = RESULTS_PER_PAGE;

        this.filters = {
            search: '',
            withOwnTranslations: false,
            withOriginalTranslationsInLocales: [],
            withoutOriginalTranslationsInLocales: [],
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
                    if (!ExtensionsPage.prototype.isEnabled(extensionId) || extension.extra.hasOwnProperty('flarum-locale')) {
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

    view() {
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
                    buttonClassName: 'Button' + (this.filters.withoutOriginalTranslationsInLocales.length ? ' FoF-Linguist-Filter--Selected' : ''),
                    label: app.translator.trans('fof-linguist.admin.filters.without-original-translations-in-locales'),
                }, localesAsArray().map(
                    locale => Button.component({
                        className: 'Button',
                        icon: `far fa-${this.filters.withoutOriginalTranslationsInLocales.includes(locale.key) ? 'check-square' : 'square'}`,
                        onclick: () => {
                            if (this.filters.withoutOriginalTranslationsInLocales.indexOf(locale.key) !== -1) {
                                this.filters.withoutOriginalTranslationsInLocales = this.filters.withoutOriginalTranslationsInLocales.filter(
                                    key => key !== locale.key
                                );
                            } else {
                                this.filters.withoutOriginalTranslationsInLocales.push(locale.key);
                            }

                            this.applyFilters();
                        },
                    }, locale.name + ' (' + locale.key + ')')
                )),
                Dropdown.component({
                    buttonClassName: 'Button' + (this.filters.withOriginalTranslationsInLocales.length ? ' FoF-Linguist-Filter--Selected' : ''),
                    label: app.translator.trans('fof-linguist.admin.filters.with-original-translations-in-locales'),
                }, localesAsArray().map(
                    locale => Button.component({
                        className: 'Button',
                        icon: `far fa-${this.filters.withOriginalTranslationsInLocales.includes(locale.key) ? 'check-square' : 'square'}`,
                        onclick: () => {
                            if (this.filters.withOriginalTranslationsInLocales.indexOf(locale.key) !== -1) {
                                this.filters.withOriginalTranslationsInLocales = this.filters.withOriginalTranslationsInLocales.filter(
                                    key => key !== locale.key
                                );
                            } else {
                                this.filters.withOriginalTranslationsInLocales.push(locale.key);
                            }

                            this.applyFilters();
                        },
                    }, locale.name + ' (' + locale.key + ')')
                )),
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

        let lowercaseSearch = '';

        if (this.filters.search) {
            lowercaseSearch = this.filters.search.toLowerCase();
        }

        this.results = app.store.all('fof-linguist-string-key').filter(key => {
            if (this.filters.withOwnTranslations && keysWithCustomTranslations.indexOf(key.key()) === -1) {
                return false;
            }

            for (let locale of this.filters.withOriginalTranslationsInLocales) {
                if (!key.locales().hasOwnProperty(locale)) {
                    return false;
                }
            }

            for (let locale of this.filters.withoutOriginalTranslationsInLocales) {
                if (key.locales().hasOwnProperty(locale)) {
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
