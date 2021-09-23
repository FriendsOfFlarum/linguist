import app from 'flarum/admin/app';
import Button from 'flarum/common/components/Button';
import Select from 'flarum/common/components/Select';
import Switch from 'flarum/common/components/Switch';
import extractText from 'flarum/common/utils/extractText';
import localesAsArray from '../utils/localesAsArray';

/* global m */

export default class ImportPage {
    oninit() {
        this.locale = 'en';
        this.overrideExisting = true;
        this.input = '';
        this.loading = false;
    }

    view() {
        const localeOptions = {};

        localesAsArray().forEach(locale => {
            localeOptions[locale.key] = locale.name + ' (' + locale.key + ')';
        });

        localeOptions.all = app.translator.trans('fof-linguist.admin.import.locale-all')

        return [
            m('h2', app.translator.trans('fof-linguist.admin.import.title')),
            m('.Form-group', [
                m('label', app.translator.trans('fof-linguist.admin.import.input')),
                m('textarea.FormControl', {
                    value: this.input,
                    oninput: event => {
                        this.input = event.target.value;
                    },
                    rows: 10,
                    placeholder: app.translator.trans('fof-linguist.admin.import.input-placeholder'),
                }),
            ]),
            m('.Form-group', [
                m('label', app.translator.trans('fof-linguist.admin.import.locale')),
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
                Switch.component({
                    state: this.overrideExisting,
                    onchange: value => {
                        this.overrideExisting = value;
                    }
                }, app.translator.trans('fof-linguist.admin.import.override-existing')),
            ]),
            m('.Form-group', Button.component({
                className: 'Button Button--primary',
                onclick: () => {
                    this.loading = true;

                    app.request({
                        method: 'POST',
                        url: app.forum.attribute('apiUrl') + '/fof/linguist/import',
                        body: {
                            input: this.input,
                            locale: this.locale,
                            ignoreExisting: !this.overrideExisting,
                        },
                    }).then(data => {
                        this.loading = false;
                        m.redraw();

                        if (confirm(extractText(app.translator.trans(this.overrideExisting ? 'fof-linguist.admin.import.results' : 'fof-linguist.admin.import.results-with-ignore', {
                            imported: data.imported + '', // Cast to string to preserve zeros
                            ignored: data.ignored + '',
                            identical: data.identical + '',
                        })))) {
                            window.location.reload();
                        }
                    }).catch(error => {
                        this.loading = false;
                        m.redraw();
                        throw error;
                    });
                },
                disabled: this.loading || !this.input,
                loading: this.loading,
            }, app.translator.trans('fof-linguist.admin.import.submit'))),
        ];
    }
}
