import app from 'flarum/app';
import Component from 'flarum/Component';
import StringEdit from 'flagrow/linguist/components/StringEdit';

export default class LinguistStringsPane extends Component {
    init() {
        app.request({
            method: 'GET',
            url: app.forum.attribute('apiUrl') + '/flagrow/linguist/strings',
        }).then(result => {
            app.store.pushPayload(result);
            m.redraw();
        });

        app.request({
            method: 'GET',
            url: app.forum.attribute('apiUrl') + '/flagrow/linguist/default-strings',
        }).then(result => {
            app.store.pushPayload(result);
            m.redraw();
        });
    }

    view() {
        const strings = app.store.all('flagrow-linguist-string');

        return m('.container', [
            m('table.Flagrow-Linguist-Strings', [
                m('thead', m('tr', [
                    m('th', app.translator.trans('flagrow-linguist.admin.strings.key')),
                    m('th', app.translator.trans('flagrow-linguist.admin.strings.locale')),
                    m('th', app.translator.trans('flagrow-linguist.admin.strings.value')),
                ])),
                m('tbody', strings.map(textString => StringEdit.component({
                    key: textString.id(),
                    textString,
                }))),
                m('tbody', StringEdit.component({
                    key: 'new',
                    textString: null,
                })),
            ]),
        ]);
    }
}
