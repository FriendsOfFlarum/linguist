import app from 'flarum/app';
import DefaultString from 'flagrow/linguist/models/DefaultString';
import TextString from 'flagrow/linguist/models/TextString';
import addLinguistStringsPane from 'flagrow/linguist/addLinguistStringsPane';

app.initializers.add('flagrow-linguist', app => {
    app.store.models['flagrow-linguist-default-string'] = DefaultString;
    app.store.models['flagrow-linguist-string'] = TextString;

    addLinguistStringsPane();
});
