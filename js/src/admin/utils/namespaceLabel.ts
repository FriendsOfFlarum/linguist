import app from "flarum/admin/app";

export default function namespaceLabel(namespace: string): string {
    const translation =
        app.translator.translations[
            "fof-linguist.admin.known-namespace." + namespace
        ];

    if (translation) {
        return translation as string;
    }

    return namespace;
}
