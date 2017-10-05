import app from 'flarum/app';
import Component from 'flarum/Component';
import Select from 'flarum/components/Select';

export default class LocaleDropdown extends Component {
    init() {
        this.options = {
            all: app.translator.trans('flagrow-linguist.admin.locales.all'),
        };

        for (let locale in app.data.locales) {
            if (!app.data.locales.hasOwnProperty(locale)) {
                continue;
            }

            this.options[locale] = app.data.locales[locale] + ' (' + locale + ')';
        }
    }

    view() {
        return Select.component({
            options: this.options,
            value: this.props.value === null ? 'all' : this.props.value,
            onchange: locale => {
                if (locale === 'all') {
                    this.props.onchange(null);
                } else {
                    this.props.onchange(locale);
                }
            },
        });
    }
}
