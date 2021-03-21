import app from 'flarum/app';
import Select from 'flarum/common/components/Select';
import Switch from 'flarum/common/components/Switch';
import LinkButton from 'flarum/common/components/LinkButton';
import localesAsArray from '../utils/localesAsArray';
import namespaceLabel from '../utils/namespaceLabel';

/* global m */

export default class ExportPage {
    oninit() {
        this.locale = 'en';
        this.namespace = null;
        this.includeOriginals = false;
        this.includeAll = false;
        this.loading = false;
        this.output = '';

        this.fetchOutput();
    }

    view(vnode) {
        const localeOptions = {};

        localesAsArray().forEach(locale => {
            localeOptions[locale.key] = locale.name + ' (' + locale.key + ')';
        });

        localeOptions.all = app.translator.trans('fof-linguist.admin.export.locale-all')

        const namespaceOptions = {
            _all: app.translator.trans('fof-linguist.admin.export.namespace-all'),
        };

        vnode.attrs.namespaces.forEach(namespace => {
            if (namespace.extension) {
                namespaceOptions[namespace.namespace] = namespace.extension.extra['flarum-extension'].title;
            } else {
                namespaceOptions[namespace.namespace] = namespaceLabel(namespace.namespace);

            }
        });

        return [
            m('h2', app.translator.trans('fof-linguist.admin.export.title')),
            m('.Form-group', m('.Alert', app.translator.trans('fof-linguist.admin.export.warning'))),
            m('.Form-group', [
                m('label', app.translator.trans('fof-linguist.admin.export.locale')),
                Select.component({
                    options: localeOptions,
                    value: this.locale,
                    onchange: value => {
                        this.locale = value;

                        this.fetchOutput();
                    },
                }),
            ]),
            m('.Form-group', [
                m('label', app.translator.trans('fof-linguist.admin.export.namespace')),
                Select.component({
                    options: namespaceOptions,
                    value: this.namespace === null ? '_all' : this.namespace,
                    onchange: value => {
                        this.namespace = value === '_all' ? null : value;

                        this.fetchOutput();
                    },
                }),
            ]),
            m('.Form-group', [
                Switch.component({
                    state: this.includeOriginals,
                    onchange: value => {
                        this.includeOriginals = value;

                        this.fetchOutput();
                    }
                }, app.translator.trans('fof-linguist.admin.export.include-originals')),
            ]),
            m('.Form-group', [
                Switch.component({
                    state: this.includeAll,
                    onchange: value => {
                        this.includeAll = value;

                        this.fetchOutput();
                    }
                }, app.translator.trans('fof-linguist.admin.export.include-all')),
            ]),
            m('.Form-group', [
                m('label', [
                    app.translator.trans('fof-linguist.admin.export.output'),
                    ' ',
                    LinkButton.component({
                        className: 'Button Button--primary',
                        href: this.exportUrl(),
                        external: true,
                        // If a namespace is selected, we use it as filename (language pack convention)
                        // otherwise we use the locale as filename (extension convention)
                        download: (this.namespace || this.locale) + '.yml',
                    }, app.translator.trans('fof-linguist.admin.export.download')),
                ]),
                m('textarea.FormControl.FoF-Export-Textarea', {
                    readonly: true,
                    value: this.output,
                    rows: 10,
                    placeholder: this.loading ? app.translator.trans('fof-linguist.admin.export.output-loading') : app.translator.trans('fof-linguist.admin.export.output-empty'),
                }),
            ]),
        ];
    }

    exportUrl() {
        return app.forum.attribute('apiUrl') + '/fof/linguist/export?' + m.buildQueryString({
            locale: this.locale,
            namespace: this.namespace,
            includeOriginals: this.includeOriginals ? '1' : '0',
            includeAll: this.includeAll ? '1' : '0',
        });
    }

    fetchOutput() {
        this.loading = true;
        this.output = '';

        app.request({
            method: 'GET',
            url: this.exportUrl(),
            // Flarum doesn't support a raw to have the raw text response
            // So we'll encode the response with JSON so Flarum can parse if afterwards
            extract: raw => JSON.stringify(raw),
        }).then(output => {
            this.loading = false;
            this.output = output;
            m.redraw();
        }).catch(error => {
            this.loading = false;
            m.redraw();
            throw error;
        });
    }
}
