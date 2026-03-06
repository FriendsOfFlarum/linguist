import Component, { ComponentAttrs } from "flarum/common/Component";
import ItemList from "flarum/common/utils/ItemList";
import type Mithril from "mithril";
import type { LocaleEntry } from "../utils/localesAsArray";
import type StringKeyModel from "../models/StringKey";
import type TextString from "../models/TextString";
export interface IStringLocaleAttrs extends ComponentAttrs {
    stringKey: StringKeyModel;
    locale: LocaleEntry | null;
    highlight?: string;
    onchange: () => void;
}
export default class StringLocale extends Component<IStringLocaleAttrs> {
    localeKey: string | null;
    originalString: string | null;
    string: TextString | undefined;
    value: string;
    dirty: boolean;
    processing: boolean;
    inputType: "input" | "textarea";
    oninit(vnode: Mithril.Vnode<IStringLocaleAttrs, this>): void;
    view(_vnode: Mithril.VnodeDOM<IStringLocaleAttrs, this>): JSX.Element;
    localeName(): Mithril.Children;
    actions(onchange: () => void): ItemList<Mithril.Children>;
    saveString(onchange: () => void): void;
    deleteString(onchange: () => void): void;
}
