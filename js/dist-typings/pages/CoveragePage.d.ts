import Component, { ComponentAttrs } from "flarum/common/Component";
import type Mithril from "mithril";
import type { NamespaceEntry } from "./LinguistPage";
type ColumnMode = "locale" | "namespace";
export interface ICoveragePageAttrs extends ComponentAttrs {
    namespaces: NamespaceEntry[];
    frontends: string[];
    browseWithFilters: (filters: Record<string, unknown>) => void;
}
export default class CoveragePage extends Component<ICoveragePageAttrs> {
    columns: ColumnMode;
    showAllFrontends: boolean;
    totalPercent: boolean;
    locale: string | string[];
    oninit(vnode: Mithril.Vnode<ICoveragePageAttrs, this>): void;
    view(vnode: Mithril.VnodeDOM<ICoveragePageAttrs, this>): JSX.Element;
    prefixCoverage(browseWithFilters: (filters: Record<string, unknown>) => void, namespace: string, frontend: string): Mithril.Children;
    localeCoverage(browseWithFilters: (filters: Record<string, unknown>) => void, locale: string, namespace?: string, frontend?: string): Mithril.Children;
}
export {};
