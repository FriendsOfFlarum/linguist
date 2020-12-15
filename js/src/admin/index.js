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

    app.extensionData.for('fof-linguist').registerPage(LinguistStringsPage);
});
