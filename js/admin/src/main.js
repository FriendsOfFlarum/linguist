import app from 'flarum/app';
import StringKey from 'flagrow/linguist/models/StringKey';
import TextString from 'flagrow/linguist/models/TextString';
import addLinguistStringsPane from 'flagrow/linguist/addLinguistStringsPane';

app.initializers.add('flagrow-linguist', app => {
    app.store.models['flagrow-linguist-string-key'] = StringKey;
    app.store.models['flagrow-linguist-string'] = TextString;

    addLinguistStringsPane();
});
