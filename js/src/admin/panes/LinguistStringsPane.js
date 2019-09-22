import app from 'flarum/app';
import Component from 'flarum/Component';
import Button from 'flarum/components/Button';
import Dropdown from 'flarum/components/Dropdown';
import ExtensionsPage from 'flarum/components/ExtensionsPage';
import Alert from 'flarum/components/Alert';
import LoadingModal from 'flarum/components/LoadingModal';
import localesAsArray from '../utils/localesAsArray';
import StringKey from '../components/StringKey';

const RESULTS_PER_PAGE = 20;

export default class LinguistStringsPane extends Component {
    init() {
        this.numberOfResultsToShow = RESULTS_PER_PAGE;

        this.filters = {
            search: '',
            withOwnTranslations: false,
            withOriginalTranslationsInLocales: [],
            withoutOriginalTranslationsInLocales: [],
            forExtension: null,
        };

        this.results = [];

        this.enabledExtensions = [];

        m.sync([
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

                // Construct an array with extensions that are enabled and have translations with the extension id as prefix
                Object.keys(app.data.extensions).forEach(extensionId => {
                    if (
                        ExtensionsPage.prototype.isEnabled(extensionId) &&
                        keys.findIndex(key => key.key().indexOf(extensionId + '.') === 0) !== -1
                    ) {
                        this.enabledExtensions.push(app.data.extensions[extensionId]);
                    }
                });
            }),
        ]).then(() => {
            this.applyFilters();
        });
    }

    view() {
        const keys = this.results.slice(0, this.numberOfResultsToShow);

        return m('.container', [
            m('div', { // The div with key needs to be outside of the ternary operation because null would break DOM ordering
                key: 'clear-cache',
            }, app.data.settings['fof.linguist.should-clear-cache'] === '1' ? Alert.component({
                children: app.translator.trans('fof-linguist.admin.clear-cache.text'),
                dismissible: false,
                controls: [Button.component({
                    className: 'Button Button--link',
                    onclick() {
                        // Same logic as in core StatusWidget
                        app.modal.show(new LoadingModal());

                        app.request({
                            method: 'DELETE',
                            url: app.forum.attribute('apiUrl') + '/cache',
                        }).then(() => window.location.reload());
                    },
                    children: app.translator.trans('fof-linguist.admin.clear-cache.button'),
                })],
            }) : null),
            m('.FoF-Linguist-Filters', {
                key: 'filters',
            }, [
                m('input.FormControl', {
                    key: 'search',
                    value: this.filters.search,
                    oninput: m.withAttr('value', value => {
                        this.filters.search = value;
                        this.applyFilters();
                    }),
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
                }, this.enabledExtensions.map(
                    extension => Button.component({
                        className: 'Button',
                        icon: `far fa-${this.filters.forExtension === extension.id ? 'check-square' : 'square'}`,
                        onclick: () => {
                            if (this.filters.forExtension === extension.id) {
                                this.filters.forExtension = null;
                            } else {
                                this.filters.forExtension = extension.id;
                            }

                            this.applyFilters();
                        },
                    }, extension.extra['flarum-extension'].title)
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
            keys.map(stringKey => m(StringKey, {
                key: stringKey.id(),
                stringKey,
                highlight: this.filters.search,
                onchange: () => {
                    // We use the setting and not a local variable because we need to preserve state
                    // if we navigate away and back to the Linguist page without refreshing the admin panel
                    app.data.settings['fof.linguist.should-clear-cache'] = '1';
                },
            })),
            m('.FoF-Linguist-Results', {
                key: 'results-stats',
            }, [
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
                console.log(locale);
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
