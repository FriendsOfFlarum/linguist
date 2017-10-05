import app from 'flarum/app';
import Component from 'flarum/Component';

export default class TranslationKeyInput extends Component {
    init() {
        this.showSuggestions = false;
    }

    view() {
        return m('.Flagrow-Linguist-Autocomplete', {
            config: this.config,
        }, [
            m('input.FormControl', {
                value: this.props.value,
                oninput: m.withAttr('value', value => {
                    this.showSuggestions = value !== '';

                    this.props.onchange(value);
                }),
                onblur: () => {
                    // Timeout: Prevent dropdown from closing when clicking on it
                    window.setTimeout(() => {
                        this.showSuggestions = false;

                        m.redraw();
                    }, 200);
                },
            }),
            (this.showSuggestions ? this.viewSuggestions() : null),
        ]);
    }

    suggestionsForFilter(filter = '') {
        let suggestions = [];

        filter = filter.toLowerCase();

        // It's better to not preload the list in init, because there's a good chance it won't have had time to load
        app.store.all('flagrow-linguist-default-string').forEach(translation => {
            if (filter === '' || translation.key().toLowerCase().indexOf(filter) !== -1 || translation.value().toLowerCase().indexOf(filter) !== -1) {
                suggestions.push(translation);
            }

            // Show up to 10 suggestions
            if (suggestions.length === 10) {
                return suggestions;
            }
        });

        return suggestions;
    }

    viewSuggestions() {
        return m('ul.Flagrow-Linguist-Autocomplete--list', this.suggestionsForFilter(this.props.value).map(
            suggestion => m('li', {
                onclick: () => {
                    this.props.onchange(suggestion.key());

                    this.$('input').focus();
                }
            }, suggestion.key() + ': ' + suggestion.value())
        ));
    }

    config(element, isInitialized, context) {
        if (isInitialized) return;

        document.addEventListener('click', this.clickedOutside.bind(this));

        context.onunload = () => {
            document.removeEventListener('click', this.clickedOutside);
        };
    }

    clickedOutside(event) {
        if ($.contains(this.element, event.target)) {
            return;
        }

        this.showSuggestions = false;

        m.redraw();
    }
}
