import app from 'flarum/app';
import Component from 'flarum/Component';
import ItemList from 'flarum/utils/ItemList';
import Button from 'flarum/components/Button';
import highlightMithril from '../utils/highlightMithril';

export default class StringLocale extends Component {
    init() {
        this.stringKey = this.props.stringKey;
        this.locale = this.props.locale;
        this.localeKey = this.locale ? this.locale.key : null;
        this.originalString = this.localeKey && this.stringKey.locales().hasOwnProperty(this.localeKey) ? this.stringKey.locales()[this.localeKey] : null;

        this.string = app.store.all('flagrow-linguist-string').find(
            string => string.key() === this.stringKey.key() && string.locale() === this.localeKey
        );

        this.value = this.string ? this.string.value() : '';
        this.dirty = false;
        this.processing = false;

        this.inputType = 'input';

        if (this.value.indexOf('\n') !== -1 || (this.originalString && this.originalString.indexOf('\n') !== -1)) {
            this.inputType = 'textarea';
        }
    }

    view() {
        const placeholderText = this.originalString ? this.originalString : '(' + app.translator.trans('flagrow-linguist.admin.placeholder.' + (this.localeKey ? 'not-translated' : 'all-locales')) + ')';

        return m('.Flagrow-Linguist-Locale', [
            m('label.Flagrow-Linguist-Label', this.localeName()),
            m('.Flagrow-Linguist-Field', {
                className: (this.value ? 'Flagrow-Linguist-Field--with-value' : '') + (this.originalString ? ' Flagrow-Linguist-Field--with-original-string' : ''),
                title: placeholderText,
            }, [
                m('.Flagrow-Linguist-Feld-Wrap', [
                    m(this.inputType, {
                        className: 'FormControl Flagrow-Linguist-Input',
                        value: this.value,
                        oninput: m.withAttr('value', value => {
                            this.value = value;
                            this.dirty = true;

                            // Remove dirty state if the user erased his text without saving
                            if (!this.value && !this.string) {
                                this.dirty = false;
                            }
                        }),
                        disabled: this.processing,
                    }),
                    m('.Flagrow-Linguist-Placeholder', [
                        m('span.Flagrow-Linguist-Placeholder-Hint', app.translator.trans('flagrow-linguist.admin.placeholder.hint')),
                        ' ',
                        m('span', this.originalString ? highlightMithril(placeholderText, this.props.highlight) : placeholderText),
                    ]),
                ]),
            ]),
            m('.Flagrow-Linguist-Controls', this.actions().toArray()),
        ]);
    }

    localeName() {
        if (this.locale) {
            return [this.locale.name + ' (', m('code', this.locale.key), ')'];
        } else {
            return app.translator.trans('flagrow-linguist.admin.locales.all');
        }
    }

    actions() {
        const items = new ItemList();

        items.add('apply', Button.component({
            type: 'button',
            className: 'Button Button--primary',
            children: app.translator.trans('flagrow-linguist.admin.buttons.apply'),
            loading: this.processing,
            disabled: !this.dirty,
            onclick: () => {
                this.saveString();
            },
        }));

        items.add('reset', Button.component({
            type: 'button',
            className: 'Button',
            children: app.translator.trans('flagrow-linguist.admin.buttons.reset'),
            loading: this.processing,
            disabled: !this.dirty && !this.string,
            onclick: () => {
                this.deleteString();
            },
        }));

        if (this.originalString) {
            items.add('copy-original', Button.component({
                type: 'button',
                className: 'Button',
                children: app.translator.trans('flagrow-linguist.admin.buttons.copy-original'),
                loading: this.processing,
                onclick: () => {
                    this.value = this.originalString;
                    this.dirty = true;
                },
            }));
        }

        return items;
    }

    saveString() {
        if (!this.value) {
            this.deleteString();

            return;
        }

        if (!this.string) {
            this.string = app.store.createRecord('flagrow-linguist-string', {
                attributes: {
                    key: this.stringKey.key(),
                    locale: this.localeKey,
                    value: '',
                },
            });
        }

        this.string.data.attributes.value = this.value;

        if (!this.string.locale()) delete this.string.data.attributes.locale;

        this.processing = true;

        this.string.save(this.string.data.attributes).then(() => {
            this.processing = false;
            this.dirty = false;

            m.redraw();
        }).catch(err => {
            this.processing = false;

            throw err;
        });
    }

    deleteString() {
        if (this.string) {
            this.processing = true;

            this.string.delete().then(() => {
                this.processing = false;
                this.dirty = false;

                this.string = null;
                this.value = '';

                m.redraw();
            }).catch(err => {
                this.processing = false;

                throw err;
            });
        } else {
            this.value = '';
            this.dirty = false;
        }
    }
}
