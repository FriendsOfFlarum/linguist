import app from 'flarum/app';

export default function () {
    let locales = [];

    for (let key in app.data.locales) {
        if (!app.data.locales.hasOwnProperty(key)) {
            continue;
        }

        locales.push({
            key,
            name: app.data.locales[key],
        });
    }

    return locales;
}
