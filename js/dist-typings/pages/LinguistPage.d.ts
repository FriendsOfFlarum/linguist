import ExtensionPage from "flarum/admin/components/ExtensionPage";
import type { Extension } from "flarum/admin/AdminApplication";
import type Mithril from "mithril";
type TabName = "strings" | "coverage" | "export" | "import";
export interface NamespaceEntry {
    namespace: string;
    extension?: Extension;
}
export default class LinguistPage extends ExtensionPage {
    tab: TabName;
    ready: boolean;
    namespaces: NamespaceEntry[];
    frontends: string[];
    initialBrowseFilters: Record<string, unknown>;
    oninit(vnode: Mithril.Vnode<any, this>): void;
    content(_vnode: Mithril.VnodeDOM<any, this>): JSX.Element;
    infoItems(): import("flarum/common/utils/ItemList").default<Mithril.Children>;
    contentTab(): Mithril.Children;
}
export {};
