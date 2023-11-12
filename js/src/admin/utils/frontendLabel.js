import app from "flarum/admin/app";

export default function (frontend) {
    const translation =
        app.translator.translations[
            "fof-linguist.admin.known-frontend." + frontend
        ];

    if (translation) {
        return translation;
    }

    return frontend;
}
