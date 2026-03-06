import Component, { ComponentAttrs } from "flarum/common/Component";
import type Mithril from "mithril";
import type { NamespaceEntry } from "./LinguistPage";
import type StringKeyModel from "../models/StringKey";
interface Filters {
    search: string;
    withOwnTranslations: boolean;
    missingTranslationsNegation: "without" | "with";
    missingTranslationsType: "any" | "original" | "own";
    missingTranslationsOperation: "or" | "and";
    missingTranslationsInLocales: string[];
    forExtension: string | null;
    frontend: string | null;
}
export interface IStringsPageAttrs extends ComponentAttrs {
    namespaces: NamespaceEntry[];
    frontends: string[];
    initialBrowseFilters: Record<string, unknown>;
}
export default class StringsPage extends Component<IStringsPageAttrs> {
    numberOfResultsToShow: number;
    filters: Filters;
    results: StringKeyModel[];
    oninit(vnode: Mithril.Vnode<IStringsPageAttrs, this>): void;
    view(vnode: Mithril.VnodeDOM<IStringsPageAttrs, this>): JSX.Element;
    applyFilters(): void;
    cacheClearInstructions(): Mithril.Children;
}
export {};
