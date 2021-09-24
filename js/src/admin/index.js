import app from 'flarum/admin/app';
import StringKey from './models/StringKey';
import TextString from './models/TextString';
import LinguistPage from './pages/LinguistPage';

export * from './components';
export * from './models';
export * from './pages';
export * from './utils';

app.initializers.add('fof-linguist', app => {
    app.store.models['fof-linguist-string-key'] = StringKey;
    app.store.models['fof-linguist-string'] = TextString;

    app.extensionData.for('fof-linguist').registerPage(LinguistPage);
});
