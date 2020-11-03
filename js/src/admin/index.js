import {extend} from 'flarum/extend';
import app from 'flarum/app';
import AdminLinkButton from 'flarum/components/AdminLinkButton';
import AdminNav from 'flarum/components/AdminNav';
import StringKey from './models/StringKey';
import TextString from './models/TextString';
import LinguistStringsPage from './pages/LinguistStringsPage';

/* global m */

app.initializers.add('fof-linguist', app => {
    app.store.models['fof-linguist-string-key'] = StringKey;
    app.store.models['fof-linguist-string'] = TextString;

    app.routes['fof-linguist-strings'] = {
        path: '/linguist',
        component: LinguistStringsPage,
    };

    app.extensionSettings['fof-linguist'] = () => m.route.set(app.route('fof-linguist-strings'));

    extend(AdminNav.prototype, 'items', items => {
        items.add('fof-linguist-strings', AdminLinkButton.component({
            href: app.route('fof-linguist-strings'),
            icon: 'fas fa-italic',
            description: app.translator.trans('fof-linguist.admin.menu.description'),
        }, app.translator.trans('fof-linguist.admin.menu.title')));
    });
});
