import StringLocale from '../components/StringLocale';
import localesAsArray from '../utils/localesAsArray';
import highlightMithril from '../utils/highlightMithril';

/* global m */

export default class StringKey {
    view(vnode) {
        const {
            stringKey,
            highlight,
            onchange,
        } = vnode.attrs;

        return m('.FoF-Linguist-Key', [
            m('.FoF-Linguist-Key-Code', m('code', highlightMithril(stringKey.key(), highlight))),
            m('.FoF-Linguist-Locales', [
                ...localesAsArray().map(locale => m(StringLocale, {
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
