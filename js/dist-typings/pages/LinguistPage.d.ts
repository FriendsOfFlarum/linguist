export default class LinguistPage extends ExtensionPage<import("flarum/admin/components/ExtensionPage").ExtensionPageAttrs> {
    constructor();
    oninit(vnode: any): void;
    tab: string | undefined;
    ready: boolean | undefined;
    namespaces: any[] | ({
        namespace: any;
        extension: import("flarum/admin/AdminApplication").Extension;
    } | {
        namespace: string;
    })[] | undefined;
    frontends: string[] | undefined;
    initialBrowseFilters: any;
    content(): any;
    contentTab(): any;
}
import ExtensionPage from "flarum/admin/components/ExtensionPage";
