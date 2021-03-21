import app from 'flarum/app';
import ExtensionPage from 'flarum/admin/components/ExtensionPage';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import StringsPage from './StringsPage';
import CoveragePage from './CoveragePage';
import ExportPage from './ExportPage';
import ImportPage from './ImportPage';

/* global m */

export default class LinguistPage extends ExtensionPage {
    oninit(vnode) {
        super.oninit(vnode);

        this.tab = 'strings';
        this.ready = false;
        this.namespaces = []; // First level of translation keys. Usually an extension ID, but also core and validation
        this.frontends = [
            'forum',
            'admin',
            'lib',
            'ref',
            'api',
        ]; // Second level of translation keys: forum, admin, ...
        this.initialBrowseFilters = {};

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

                const namespaces = [];

                keys.forEach(key => {
                    const parts = key.key().split('.');

                    const namespace = parts[0];

                    if (['core', 'validation'].indexOf(namespace) === -1 && namespaces.indexOf(namespace) === -1) {
                        namespaces.push(namespace);
                    }

                    if (parts.length > 1 && namespace !== 'validation') {
                        const frontend = parts[1];

                        if (this.frontends.indexOf(frontend) === -1) {
                            this.frontends.push(frontend);
                        }
                    }
                });

                namespaces.sort();

                this.namespaces = [
                    {
                        namespace: 'core',
                    },
                    {
                        namespace: 'validation',
                    },
                    ...namespaces.map(namespace => {
                        // First we look if the namespace matches an extension ID, that's the most common naming
                        let extension = app.data.extensions[namespace];

                        // If that's unsuccessful, we'll look if the full package name was used as namespace
                        if (!extension) {
                            extension = Object.values(app.data.extensions).find(extension => {
                                const packageNameWithDash = extension.name.replace('/', '-');

                                return namespace === packageNameWithDash;
                            });
                        }

                        return {
                            namespace,
                            extension,
                        };
                    }),
                ];
            }),
        ]).then(() => {
            this.ready = true;
            m.redraw();
        });
    }

    content() {
        return m('.ExtensionPage-settings', m('.container', [
            this.contentTab(),
        ]));
    }

    infoItems() {
        const items = super.infoItems();

        items.add('linguist-tabs', m('ul.FoF-Linguist-Tabs', [
            m('li', m('a', {
                className: this.tab === 'strings' ? 'active' : '',
                onclick: () => {
                    this.tab = 'strings';
                },
            }, app.translator.trans('fof-linguist.admin.tabs.strings'))),
            m('li', m('a', {
                className: this.tab === 'coverage' ? 'active' : '',
                onclick: () => {
                    this.tab = 'coverage';
                },
            }, app.translator.trans('fof-linguist.admin.tabs.coverage'))),
            m('li', m('a', {
                className: this.tab === 'export' ? 'active' : '',
                onclick: () => {
                    this.tab = 'export';
                },
            }, app.translator.trans('fof-linguist.admin.tabs.export'))),
            m('li', m('a', {
                className: this.tab === 'import' ? 'active' : '',
                onclick: () => {
                    this.tab = 'import';
                },
            }, app.translator.trans('fof-linguist.admin.tabs.import'))),
        ]), 100);

        return items;
    }

    contentTab() {
        if (!this.ready) {
            return LoadingIndicator.component();
        }

        switch (this.tab) {
            case 'strings':
                return m(StringsPage, {
                    namespaces: this.namespaces,
                    frontends: this.frontends,
                    initialBrowseFilters: this.initialBrowseFilters,
                });
            case 'coverage':
                return m(CoveragePage, {
                    namespaces: this.namespaces,
                    frontends: this.frontends,
                    browseWithFilters: filters => {
                        this.initialBrowseFilters = filters;
                        this.tab = 'strings';
                    },
                });
            case 'export':
                return m(ExportPage, {
                    namespaces: this.namespaces,
                });
            case 'import':
                return m(ImportPage);
        }

        return null;
    }
}
