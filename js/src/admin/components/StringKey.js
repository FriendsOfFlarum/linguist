import Component from 'flarum/Component';
import StringLocale from '../components/StringLocale';
import localesAsArray from '../utils/localesAsArray';
import highlightMithril from '../utils/highlightMithril';

export default class StringKey extends Component {
    view() {
        const {
            stringKey,
            highlight,
            onchange,
        } = this.props;

        return m('.FoF-Linguist-Key', [
            m('.FoF-Linguist-Key-Code', m('code', highlightMithril(stringKey.key(), highlight))),
            m('.FoF-Linguist-Locales', [
                localesAsArray().map(locale => m(StringLocale, {
                    key: locale.key,
                    locale,
                    stringKey,
                    highlight,
                    onchange,
                })),
                m(StringLocale, {
                    key: 'all',
                    locale: null,
                    stringKey,
                    highlight,
                    onchange,
                }),
            ]),
        ]);
    }
}
