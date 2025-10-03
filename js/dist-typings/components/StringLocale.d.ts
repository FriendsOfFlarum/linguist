export default class StringLocale {
    oninit(vnode: any): void;
    stringKey: any;
    locale: any;
    localeKey: any;
    originalString: any;
    string: import("flarum/common/Model").default | null | undefined;
    value: any;
    dirty: boolean | undefined;
    processing: boolean | undefined;
    inputType: string | undefined;
    view(vnode: any): any;
    localeName(): string | any[];
    actions(onchange: any): ItemList<any>;
    saveString(onchange: any): void;
    deleteString(onchange: any): void;
}
import ItemList from "flarum/common/utils/ItemList";
