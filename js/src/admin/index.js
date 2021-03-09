import app from 'flarum/app';
import StringKey from './models/StringKey';
import TextString from './models/TextString';
import LinguistPage from './pages/LinguistPage';

app.initializers.add('fof-linguist', app => {
    app.store.models['fof-linguist-string-key'] = StringKey;
    app.store.models['fof-linguist-string'] = TextString;

    app.extensionData.for('fof-linguist').registerPage(LinguistPage);
});
