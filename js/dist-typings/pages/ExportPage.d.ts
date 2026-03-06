import Component, { ComponentAttrs } from "flarum/common/Component";
import type Mithril from "mithril";
import type { NamespaceEntry } from "./LinguistPage";
export interface IExportPageAttrs extends ComponentAttrs {
    namespaces: NamespaceEntry[];
}
export default class ExportPage extends Component<IExportPageAttrs> {
    locale: string;
    namespace: string | null;
    includeOriginals: boolean;
    includeAll: boolean;
    loading: boolean;
    output: string;
    oninit(vnode: Mithril.Vnode<IExportPageAttrs, this>): void;
    view(_vnode: Mithril.VnodeDOM<IExportPageAttrs, this>): JSX.Element;
    exportUrl(): string;
    fetchOutput(): void;
}
