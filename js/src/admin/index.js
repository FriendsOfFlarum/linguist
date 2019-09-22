import app from 'flarum/app';
import StringKey from './models/StringKey';
import TextString from './models/TextString';
import addLinguistStringsPane from './addLinguistStringsPane';

app.initializers.add('fof-linguist', app => {
    app.store.models['fof-linguist-string-key'] = StringKey;
    app.store.models['fof-linguist-string'] = TextString;

    addLinguistStringsPane();
});
