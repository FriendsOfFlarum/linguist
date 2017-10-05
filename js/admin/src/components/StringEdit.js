import app from 'flarum/app';
import Component from 'flarum/Component';
import Button from 'flarum/components/Button';
import LocaleDropdown from 'flagrow/linguist/components/LocaleDropdown';
import TranslationKeyInput from 'flagrow/linguist/components/TranslationKeyInput';

export default class StringEdit extends Component {
    init() {
        this.textString = this.props.textString;
        this.dirty = false;
        this.processing = false;

        if (this.textString === null) {
            this.initNewString();
        }
    }

    initNewString() {
        this.textString = app.store.createRecord('flagrow-linguist-string', {
            attributes: {
                key: '',
                locale: null,
                value: '',
            }
        });
    }

    view() {
        return m('tr', [
            m('td', [
                TranslationKeyInput.component({
                    value: this.textString.key(),
                    onchange: this.updateAttribute.bind(this, 'key'),
                })
            ]),
            m('td', [
                LocaleDropdown.component({
                    value: this.textString.locale(),
                    onchange: this.updateAttribute.bind(this, 'locale'),
                }),
            ]),
            m('td', [
                m('input.FormControl', {
                    value: this.textString.value(),
                    oninput: m.withAttr('value', this.updateAttribute.bind(this, 'value')),
                }),
            ]),
            m('td', m('li.ButtonGroup', [
                Button.component({
                    type: 'submit',
                    className: 'Button Button--primary',
                    children: app.translator.trans('flagrow-linguist.admin.buttons.' + (this.textString.exists ? 'save' : 'add') + '-string'),
                    loading: this.processing,
                    disabled: !this.dirty,
                    onclick: this.saveString.bind(this),
                }),
                (this.textString.exists ? Button.component({
                    type: 'submit',
                    className: 'Button Button--danger',
                    children: app.translator.trans('flagrow-linguist.admin.buttons.delete-string'),
                    loading: this.processing,
                    onclick: this.deleteString.bind(this),
                }) : ''),
            ])),
        ]);
    }

    updateAttribute(attribute, value) {
        this.textString.pushAttributes({
            [attribute]: value,
        });

        this.dirty = true;
    }

    saveString() {
        this.processing = true;

        const wasNew = !this.textString.exists;

        this.textString.save(this.textString.data.attributes).then(() => {
            this.processing = false;
            this.dirty = false;

            if (wasNew) {
                this.initNewString();
            }

            m.redraw();
        }).catch(err => {
            this.processing = false;

            throw err;
        });
    }

    deleteString() {
        this.processing = true;

        this.textString.delete().then(() => {
            this.processing = false;

            m.redraw();
        }).catch(err => {
            this.processing = false;

            throw err;
        });
    }
}
