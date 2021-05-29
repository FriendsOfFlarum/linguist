import app from 'flarum/admin/app';

export default function (namespace) {
    const translation = app.translator.translations['fof-linguist.admin.known-namespace.' + namespace];

    if (translation) {
        return translation;
    }

    return namespace;
}
