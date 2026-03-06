import app from "flarum/admin/app";

export default function frontendLabel(frontend: string): string {
    const translation =
        app.translator.translations[
            "fof-linguist.admin.known-frontend." + frontend
        ];

    if (translation) {
        return translation as string;
    }

    return frontend;
}
