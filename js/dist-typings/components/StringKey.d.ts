/// <reference types="mithril" />
import Component, { ComponentAttrs } from "flarum/common/Component";
import type StringKeyModel from "../models/StringKey";
export interface IStringKeyAttrs extends ComponentAttrs {
    stringKey: StringKeyModel;
    highlight?: string;
    onchange: () => void;
}
export default class StringKey<CustomAttrs extends IStringKeyAttrs = IStringKeyAttrs> extends Component<CustomAttrs> {
    view(): JSX.Element;
}
