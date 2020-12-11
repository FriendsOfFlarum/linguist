import app from 'flarum/app';
import ItemList from 'flarum/utils/ItemList';
import Button from 'flarum/components/Button';
import highlightMithril from '../utils/highlightMithril';

/* global m */

export default class StringLocale {
    oninit(vnode) {
        this.stringKey = vnode.attrs.stringKey;
        this.locale = vnode.attrs.locale;
        this.localeKey = this.locale ? this.locale.key : null;
        this.originalString = this.localeKey && this.stringKey.locales().hasOwnProperty(this.localeKey) ? this.stringKey.locales()[this.localeKey] : null;

        this.string = app.store.all('fof-linguist-string').find(
            string => string.key() === this.stringKey.key() && string.locale() === this.localeKey
        );

        this.value = this.string ? this.string.value() : '';
        this.dirty = false;
        this.processing = false;

        // We check whether any original translation in any language has a newline
        // By not hard-coding to English, this should work pretty well even if the fallback locale is modified,
        // or if a text happens to not be available in the fallback language
        const originalHasNewLine = Object.keys(this.stringKey.locales()).some(key => this.stringKey.locales()[key].indexOf('\n') !== -1);

        this.inputType = 'input';

        // We will enable multi-line editing if the original has a newline, or if the current custom value already has one
        if (originalHasNewLine || this.value.indexOf('\n') !== -1) {
            this.inputType = 'textarea';
        }
    }

    view(vnode) {
        const placeholderText = this.originalString ? this.originalString : '(' + app.translator.trans('fof-linguist.admin.placeholder.' + (this.localeKey ? 'not-translated' : 'all-locales')) + ')';

        return m('.FoF-Linguist-Locale', [
            m('label.FoF-Linguist-Label', this.localeName()),
            m('.FoF-Linguist-Field', {
                className: (this.value ? 'FoF-Linguist-Field--with-value' : '') + (this.originalString ? ' FoF-Linguist-Field--with-original-string' : ''),
                title: placeholderText,
            }, [
                m('.FoF-Linguist-Field-Wrap', [
                    m(this.inputType, {
                        className: 'FormControl FoF-Linguist-Input',
                        value: this.value,
                        oninput: event => {
                            this.value = event.target.value;
                            this.dirty = true;

                            // Remove dirty state if the user erased his text without saving
                            if (!this.value && !this.string) {
                                this.dirty = false;
                            }
                        },
                        disabled: this.processing,
                    }),
                    m('.FoF-Linguist-Placeholder', [
                        m('span.FoF-Linguist-Placeholder-Hint', app.translator.trans('fof-linguist.admin.placeholder.hint')),
                        ' ',
                        m('span', this.originalString ? highlightMithril(placeholderText, vnode.attrs.highlight) : placeholderText),
                    ]),
                ]),
            ]),
            m('.FoF-Linguist-Controls', this.actions(vnode.attrs.onchange).toArray()),
        ]);
    }

    localeName() {
        if (this.locale) {
            return [this.locale.name + ' (', m('code', this.locale.key), ')'];
        } else {
            return app.translator.trans('fof-linguist.admin.locales.all');
        }
    }

    actions(onchange) {
        const items = new ItemList();

        items.add('apply', Button.component({
            type: 'button',
            className: 'Button Button--primary',
            loading: this.processing,
            disabled: !this.dirty,
            onclick: () => {
                this.saveString(onchange);
            },
        }, app.translator.trans('fof-linguist.admin.buttons.apply')));

        items.add('reset', Button.component({
            type: 'button',
            className: 'Button',
            loading: this.processing,
            disabled: !this.dirty && !this.string,
            onclick: () => {
                this.deleteString(onchange);
            },
        }, app.translator.trans('fof-linguist.admin.buttons.reset')));

        if (this.originalString) {
            items.add('copy-original', Button.component({
                type: 'button',
                className: 'Button',
                loading: this.processing,
                onclick: () => {
                    this.value = this.originalString;
                    this.dirty = true;
                },
            }, app.translator.trans('fof-linguist.admin.buttons.copy-original')));
        }

        return items;
    }

    saveString(onchange) {
        if (!this.value) {
            this.deleteString(onchange);

            return;
        }

        if (!this.string) {
            this.string = app.store.createRecord('fof-linguist-string', {
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

            onchange();

            m.redraw();
        }).catch(err => {
            this.processing = false;

            throw err;
        });
    }

    deleteString(onchange) {
        if (this.string) {
            this.processing = true;

            this.string.delete().then(() => {
                this.processing = false;
                this.dirty = false;

                this.string = null;
                this.value = '';

                onchange();

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
