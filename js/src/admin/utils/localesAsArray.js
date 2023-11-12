import app from "flarum/admin/app";

export default function () {
    let locales = [];

    let englishFound = false;

    for (let key in app.data.locales) {
        if (!app.data.locales.hasOwnProperty(key)) {
            continue;
        }

        if (key === "en") {
            englishFound = true;
        }

        locales.push({
            key,
            name: app.data.locales[key],
        });
    }

    // Always show English for the following reasons:
    // It's the fallback locale, so the translations are always active
    // It's the bundled locale for most extensions, so it makes sense to have access to it as reference
    if (!englishFound) {
        locales.unshift({
            key: "en",
            // Hard-coded to the same value as in flarum/lang-english composer.json
            // Since other locale names won't be translated to the current language either it doesn't make sense to use a translation
            name: "English",
        });
    }

    return locales;
}
