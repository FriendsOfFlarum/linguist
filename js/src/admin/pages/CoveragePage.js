import app from 'flarum/admin/app';
import Button from 'flarum/common/components/Button';
import icon from 'flarum/common/helpers/icon';
import localesAsArray from '../utils/localesAsArray';
import namespaceLabel from '../utils/namespaceLabel';
import frontendLabel from '../utils/frontendLabel';

/* global m */

export default class CoveragePage {
    oninit() {
        this.columns = 'locale';
        this.showAllFrontends = false;
        this.totalPercent = true;
        this.locale = [];

        const firstNonEnglishLocale = localesAsArray().find(locale => locale.key !== 'en');

        if (firstNonEnglishLocale) {
            this.locale = firstNonEnglishLocale.key;
        }
    }

    view(vnode) {
        let visibleFrontends = vnode.attrs.frontends.slice(0, 2);

        if (this.showAllFrontends) {
            visibleFrontends = vnode.attrs.frontends;
        }

        const {browseWithFilters} = vnode.attrs;

        return [
            m('.FoF-Linguist-Filters', [
                m('.ButtonGroup', [
                    Button.component({
                        className: 'Button' + (this.totalPercent ? ' active' : ''),
                        onclick: () => {
                            this.totalPercent = true;
                        },
                    }, app.translator.trans('fof-linguist.admin.coverage.total-options.percent')),
                    Button.component({
                        className: 'Button' + (this.totalPercent ? ' ' : ' active'),
                        onclick: () => {
                            this.totalPercent = false;
                        },
                    }, app.translator.trans('fof-linguist.admin.coverage.total-options.count')),
                ]),
                m('.ButtonGroup', [
                    Button.component({
                        className: 'Button' + (this.columns === 'locale' ? ' active' : ''),
                        onclick: () => {
                            this.columns = 'locale';
                        },
                    }, app.translator.trans('fof-linguist.admin.coverage.column-options.locale')),
                    Button.component({
                        className: 'Button' + (this.columns === 'namespace' ? ' active' : ''),
                        onclick: () => {
                            this.columns = 'namespace';
                            this.showAllFrontends = false;
                        },
                    }, app.translator.trans('fof-linguist.admin.coverage.column-options.namespace')),
                ]),
                this.columns === 'namespace' ? m('.ButtonGroup', localesAsArray().map(
                    locale => Button.component({
                        className: 'Button' + (this.locale === locale.key ? ' active' : ''),
                        onclick: () => {
                            if (this.locale !== locale.key) {
                                this.locale = locale.key;
                            }
                        },
                    }, locale.name + ' (' + locale.key + ')')
                )) : null,
            ]),
            m('table.FoF-Linguist-Coverage', [
                m('thead', m('tr', [
                    m('th', app.translator.trans('fof-linguist.admin.coverage.columns.namespace')),
                    this.columns === 'locale' ? localesAsArray().map(locale => m('th', locale.name + ' (' + locale.key + ')')) : [
                        this.showAllFrontends ? visibleFrontends.map(frontend => m('th', frontendLabel(frontend))) : [
                            m('th', app.translator.trans('fof-linguist.admin.coverage.columns.all-except-admin')),
                            m('th', frontendLabel('admin')),
                            m('th', Button.component({
                                className: 'Button',
                                onclick: () => {
                                    this.showAllFrontends = true;
                                },
                            }, app.translator.trans('fof-linguist.admin.coverage.columns.all-frontends'))),
                        ],
                    ],
                ])),
                m('tbody', [
                    this.columns === 'locale' ? m('tr', [
                        m('td', [
                            m('span.FoF-Linguist-Coverage-Extension-Icon.FoF-Linguist-Coverage-Namespace-Icon'),
                            m('span.FoF-Linguist-Coverage-Extension-Title', app.translator.trans('fof-linguist.admin.coverage.all-namespaces')),
                        ]),
                        localesAsArray().map(locale => m('td', this.localeCoverage(browseWithFilters, locale.key))),
                    ]) : null,
                    vnode.attrs.namespaces.map(namespace => {
                        return m('tr', [
                            m('td', namespace.extension ? [
                                m('span.FoF-Linguist-Coverage-Extension-Icon', {
                                    style: namespace.extension.icon,
                                }, namespace.extension.icon ? icon(namespace.extension.icon.name) : ''),
                                m('span.FoF-Linguist-Coverage-Extension-Title', namespace.extension.extra['flarum-extension'].title),
                            ] : [
                                m('span.FoF-Linguist-Coverage-Extension-Icon.FoF-Linguist-Coverage-Namespace-Icon'),
                                m('span.FoF-Linguist-Coverage-Extension-Title', namespaceLabel(namespace.namespace)),
                            ]),
                            this.columns === 'locale' ? localesAsArray().map(locale => m('td', this.localeCoverage(browseWithFilters, locale.key, namespace.namespace))) : [
                                this.showAllFrontends ?
                                    visibleFrontends.map(frontend => m('td', this.prefixCoverage(browseWithFilters, namespace.namespace, frontend))) : [
                                        m('td', this.prefixCoverage(browseWithFilters, namespace.namespace, '_all_except_admin')),
                                        m('td', this.prefixCoverage(browseWithFilters, namespace.namespace, 'admin')),
                                    ],
                            ],
                        ]);
                    }),
                ]),
            ]),
        ];
    }

    prefixCoverage(browseWithFilters, namespace, frontend) {
        if (!this.locale) {
            return null;
        }

        return this.localeCoverage(browseWithFilters, this.locale, namespace, frontend);
    }

    localeCoverage(browseWithFilters, locale, namespace, frontend) {
        const stringKeys = app.store.all('fof-linguist-string-key').filter(key => {
            if (!namespace) {
                return true;
            }

            const parts = key.key().split('.');

            if (parts[0] !== namespace) {
                return false;
            }

            if (frontend === '_all_except_admin') {
                if (parts.length >= 2 && parts[1] === 'admin') {
                    return false;
                }
            } else if (frontend && (parts.length < 2 || parts[1] !== frontend)) {
                return false;
            }

            return true;
        });

        if (stringKeys.length === 0) {
            return '-';
        }

        let customCount = 0;
        let originalCount = 0;

        stringKeys.forEach(stringKey => {
            const customString = app.store.all('fof-linguist-string').find(
                string => string.key() === stringKey.key() && string.locale() === locale
            );

            if (customString) {
                customCount++;
            } else if (stringKey.locales().hasOwnProperty(locale)) {
                originalCount++;
            }
        });

        const percent = Math.round(((customCount + originalCount) / stringKeys.length) * 100);

        let specialStyle;

        if (percent === 100) {
            specialStyle = 'full';
        } else if (percent < 5) {
            specialStyle = 'low';
        }

        let label;

        if (this.totalPercent) {
            label = app.translator.trans('fof-linguist.admin.coverage.count.percent', {
                percent: percent + '', // Keeps zero as string
            });
        } else {
            label = app.translator.trans('fof-linguist.admin.coverage.count.total', {
                translated: (customCount + originalCount) + '', // Keeps zero as string
                total: stringKeys.length,
            });
        }

        return m('.FoF-Linguist-Coverage-Progress-Wrap', [
            m('.FoF-Linguist-Progress', {
                className: specialStyle ? 'FoF-Linguist-Progress--' + specialStyle : '',
            }, [
                m('.FoF-Linguist-Progress-Bar', {
                    style: {
                        width: Math.max(percent, 5) + '%', // Always show the progress bar even if very close to 0
                    },
                }),
                m('.FoF-Linguist-Progress-Label', label),
                m('.FoF-Linguist-Progress-More', app.translator.trans('fof-linguist.admin.coverage.count.details', {
                    total: stringKeys.length,
                    original: originalCount + '', // Cast to string to preserve zero
                    custom: customCount + '',
                })),
            ]),
            Button.component({
                icon: 'fas fa-filter',
                className: 'Button Button--icon',
                onclick: () => {
                    const options = {
                        missingTranslationsInLocales: [locale],
                    };

                    if (namespace) {
                        options.forExtension = namespace;
                    }

                    if (frontend) {
                        options.frontend = frontend;
                    }

                    browseWithFilters(options);
                },
                title: app.translator.trans('fof-linguist.admin.coverage.apply-missing-filter'),
            }),
        ]);
    }
}
