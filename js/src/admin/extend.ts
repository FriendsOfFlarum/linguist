import app from "flarum/admin/app";
import Extend from "flarum/common/extenders";
import StringKey from "./models/StringKey";
import TextString from "./models/TextString";
import LinguistPage from "./pages/LinguistPage";

export default [
    new Extend.Store() //
        .add("fof-linguist-string-keys", StringKey)
        .add("fof-linguist-strings", TextString),

    new Extend.Admin() //
        .page(LinguistPage)
        .permission(
            () => ({
                icon: "fas fa-italic",
                label: app.translator.trans(
                    "fof-linguist.admin.permissions.view_string_keys",
                ),
                permission: "viewStringKeys",
                allowGuest: true,
            }),
            "view",
        ),
];
