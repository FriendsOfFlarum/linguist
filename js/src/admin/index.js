import app from 'flarum/app';
import StringKey from './models/StringKey';
import TextString from './models/TextString';
import addLinguistStringsPane from './addLinguistStringsPane';

app.initializers.add('flagrow-linguist', app => {
    app.store.models['flagrow-linguist-string-key'] = StringKey;
    app.store.models['flagrow-linguist-string'] = TextString;

    addLinguistStringsPane();
});
