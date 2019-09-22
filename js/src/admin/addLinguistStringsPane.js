import {extend} from 'flarum/extend';
import app from 'flarum/app';
import AdminNav from 'flarum/components/AdminNav';
import AdminLinkButton from 'flarum/components/AdminLinkButton';
import LinguistStringsPane from './panes/LinguistStringsPane';

export default function () {
    app.routes['fof-linguist-strings'] = {
        path: '/linguist',
        component: LinguistStringsPane.component(),
    };

    app.extensionSettings['fof-linguist'] = () => m.route(app.route('fof-linguist-strings'));

    extend(AdminNav.prototype, 'items', items => {
        items.add('fof-linguist-strings', AdminLinkButton.component({
            href: app.route('fof-linguist-strings'),
            icon: 'fas fa-italic',
            children: app.translator.trans('fof-linguist.admin.menu.title'),
            description: app.translator.trans('fof-linguist.admin.menu.description'),
        }));
    });
}
