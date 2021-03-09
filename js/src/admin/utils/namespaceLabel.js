import app from 'flarum/app';

export default function (namespace) {
    const translation = app.translator.translations['fof-linguist.admin.known-namespace.' + namespace];

    if (translation) {
        return translation;
    }

    return namespace;
}
