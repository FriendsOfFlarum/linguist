import app from 'flarum/app';
import Button from 'flarum/components/Button';
import Dropdown from 'flarum/components/Dropdown';
import Select from 'flarum/components/Select';
import Alert from 'flarum/components/Alert';
import LoadingModal from 'flarum/components/LoadingModal';
import localesAsArray from '../utils/localesAsArray';
import StringKey from '../components/StringKey';
import namespaceLabel from '../utils/namespaceLabel';
import frontendLabel from '../utils/frontendLabel';

/* global m */

const RESULTS_PER_PAGE = 20;

export default class StringsPage {
    oninit(vnode) {
        this.numberOfResultsToShow = RESULTS_PER_PAGE;

        this.filters = Object.assign({
            search: '',
            withOwnTranslations: false,
            missingTranslationsNegation: 'without',
            missingTranslationsType: 'any',
            missingTranslationsInLocale: null,
            forExtension: null,
            frontend: null,
        }, vnode.attrs.initialBrowseFilters || {});

        this.results = [];

        this.applyFilters();
    }

    view(vnode) {
        const keys = this.results.slice(0, this.numberOfResultsToShow);

        return [
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
                }, vnode.attrs.namespaces.map(
                    namespace => Button.component({
                        className: 'Button',
                        icon: `far fa-${this.filters.forExtension === namespace.namespace ? 'dot-circle' : 'circle'}`,
                        onclick: () => {
                            if (this.filters.forExtension === namespace.namespace) {
                                this.filters.forExtension = null;
                            } else {
                                this.filters.forExtension = namespace.namespace;
                            }

                            this.applyFilters();
                        },
                    }, namespace.extension ? namespace.extension.extra['flarum-extension'].title : namespaceLabel(namespace.namespace))
                )),
                Dropdown.component({
                    buttonClassName: 'Button' + (this.filters.frontend ? ' FoF-Linguist-Filter--Selected' : ''),
                    label: app.translator.trans('fof-linguist.admin.filters.frontend'),
                }, [
                    '_all_except_admin',
                    ...vnode.attrs.frontends,
                ].map(
                    frontend => Button.component({
                        className: 'Button',
                        icon: `far fa-${this.filters.frontend === frontend ? 'dot-circle' : 'circle'}`,
                        onclick: () => {
                            if (this.filters.frontend === frontend) {
                                this.filters.frontend = null;
                            } else {
                                this.filters.frontend = frontend;
                            }

                            this.applyFilters();
                        },
                    }, frontend === '_all_except_admin' ? app.translator.trans('fof-linguist.admin.filters.frontend-all-except-admin') : frontendLabel(frontend))
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
        ];
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

            if (this.filters.frontend) {
                const parts = key.key().split('.');

                if (this.filters.frontend === '_all_except_admin') {
                    // We will keep everything that isn't admin, including if it's a single level deep
                    if (parts.length >= 2 && parts[1] === 'admin') {
                        return false;
                    }
                } else {
                    // Keep only parts with 2 levels or more where second level matches frontend
                    if (parts.length < 2 || parts[1] !== this.filters.frontend) {
                        return false;
                    }
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
