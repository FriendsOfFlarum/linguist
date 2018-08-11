import {extend} from 'flarum/extend';
import app from 'flarum/app';
import AdminNav from 'flarum/components/AdminNav';
import AdminLinkButton from 'flarum/components/AdminLinkButton';
import LinguistStringsPane from './panes/LinguistStringsPane';

export default function () {
    // create the route
    app.routes['flagrow-linguist-strings'] = {
        path: '/flagrow/linguist',
        component: LinguistStringsPane.component(),
    };

    // bind the route we created to the three dots settings button
    app.extensionSettings['flagrow-linguist'] = () => m.route(app.route('flagrow-linguist-strings'));

    extend(AdminNav.prototype, 'items', items => {
        // add the Image Upload tab to the admin navigation menu
        items.add('flagrow-linguist-strings', AdminLinkButton.component({
            href: app.route('flagrow-linguist-strings'),
            icon: 'fas fa-italic',
            children: app.translator.trans('flagrow-linguist.admin.menu.title'),
            description: app.translator.trans('flagrow-linguist.admin.menu.description'),
        }));
    });
}
