import Component from 'flarum/Component';
import localesAsArray from 'flagrow/linguist/utils/localesAsArray';
import StringLocale from 'flagrow/linguist/components/StringLocale';
import highlightMithril from 'flagrow/linguist/utils/highlightMithril';

export default class StringKey extends Component {
    view() {
        const stringKey = this.props.stringKey;
        const highlight = this.props.highlight;

        return m('.Flagrow-Linguist-Key', [
            m('.Flagrow-Linguist-Key-Code', m('code', highlightMithril(stringKey.key(), highlight))),
            m('.Flagrow-Linguist-Locales', [
                localesAsArray().map(locale => m(StringLocale, {
                    key: locale.key,
                    locale,
                    stringKey,
                    highlight,
                })),
                m(StringLocale, {
                    key: 'all',
                    locale: null,
                    stringKey,
                    highlight,
                }),
            ]),
        ]);
    }
}
