import Component, { ComponentAttrs } from "flarum/common/Component";

import StringLocale from "./StringLocale";
import localesAsArray from "../utils/localesAsArray";
import highlightMithril from "../utils/highlightMithril";

import type StringKeyModel from "../models/StringKey";

export interface IStringKeyAttrs extends ComponentAttrs {
    stringKey: StringKeyModel;
    highlight?: string;
    onchange: () => void;
}

export default class StringKey<
    CustomAttrs extends IStringKeyAttrs = IStringKeyAttrs,
> extends Component<CustomAttrs> {
    view(): JSX.Element {
        const { stringKey, highlight, onchange } = this.attrs;

        return (
            <div className="FoF-Linguist-Key">
                <div className="FoF-Linguist-Key-Code">
                    <code>{highlightMithril(stringKey.key(), highlight)}</code>
                </div>
                <div className="FoF-Linguist-Locales">
                    {localesAsArray().map((locale) => (
                        <StringLocale
                            locale={locale}
                            stringKey={stringKey}
                            highlight={highlight}
                            onchange={onchange}
                        />
                    ))}
                    <StringLocale
                        locale={null}
                        stringKey={stringKey}
                        highlight={highlight}
                        onchange={onchange}
                    />
                </div>
            </div>
        );
    }
}
