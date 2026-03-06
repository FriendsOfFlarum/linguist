import app from "flarum/admin/app";
import Component, { ComponentAttrs } from "flarum/common/Component";
import ItemList from "flarum/common/utils/ItemList";
import Button from "flarum/common/components/Button";
import type Mithril from "mithril";

import type { LocaleEntry } from "../utils/localesAsArray";
import highlightMithril from "../utils/highlightMithril";
import type StringKeyModel from "../models/StringKey";
import type TextString from "../models/TextString";

export interface IStringLocaleAttrs extends ComponentAttrs {
    stringKey: StringKeyModel;
    locale: LocaleEntry | null;
    highlight?: string;
    onchange: () => void;
}

export default class StringLocale extends Component<IStringLocaleAttrs> {
    localeKey!: string | null;
    originalString!: string | null;
    string!: TextString | undefined;
    value!: string;
    dirty!: boolean;
    processing!: boolean;
    inputType!: "input" | "textarea";

    oninit(vnode: Mithril.Vnode<IStringLocaleAttrs, this>) {
        super.oninit(vnode);

        const { stringKey, locale } = this.attrs;

        this.localeKey = locale ? locale.key : null;
        this.originalString =
            this.localeKey &&
            stringKey.locales()!.hasOwnProperty(this.localeKey)
                ? stringKey.locales()![this.localeKey]
                : null;

        this.string = app.store
            .all<TextString>("fof-linguist-strings")
            .find(
                (string) =>
                    string.key() === stringKey.key() &&
                    string.locale() === this.localeKey,
            );

        this.value = this.string ? this.string.value() || "" : "";
        this.dirty = false;
        this.processing = false;

        // We check whether any original translation in any language has a newline
        // By not hard-coding to English, this should work pretty well even if the fallback locale is modified,
        // or if a text happens to not be available in the fallback language
        const originalHasNewLine = Object.keys(stringKey.locales()!).some(
            (key) => stringKey.locales()![key].indexOf("\n") !== -1,
        );

        this.inputType = "input";

        // We will enable multi-line editing if the original has a newline, or if the current custom value already has one
        if (originalHasNewLine || this.value.indexOf("\n") !== -1) {
            this.inputType = "textarea";
        }
    }

    view(_vnode: Mithril.VnodeDOM<IStringLocaleAttrs, this>): JSX.Element {
        const { highlight } = this.attrs;

        const placeholderText = this.originalString
            ? this.originalString
            : "(" +
              app.translator.trans(
                  "fof-linguist.admin.placeholder." +
                      (this.localeKey ? "not-translated" : "all-locales"),
              ) +
              ")";

        const fieldClass =
            (this.value ? "FoF-Linguist-Field--with-value" : "") +
            (this.originalString
                ? " FoF-Linguist-Field--with-original-string"
                : "");

        const InputTag = this.inputType;

        return (
            <div className="FoF-Linguist-Locale">
                <label className="FoF-Linguist-Label">
                    {this.localeName()}
                </label>
                <div
                    className={"FoF-Linguist-Field " + fieldClass}
                    title={placeholderText as string}
                >
                    <div className="FoF-Linguist-Field-Wrap">
                        <InputTag
                            className="FormControl FoF-Linguist-Input"
                            value={this.value}
                            oninput={(event: InputEvent) => {
                                this.value = (
                                    event.target as HTMLInputElement
                                ).value;
                                this.dirty = true;

                                // Remove dirty state if the user erased his text without saving
                                if (!this.value && !this.string) {
                                    this.dirty = false;
                                }
                            }}
                            disabled={this.processing}
                        />
                        <div className="FoF-Linguist-Placeholder">
                            <span className="FoF-Linguist-Placeholder-Hint">
                                {app.translator.trans(
                                    "fof-linguist.admin.placeholder.hint",
                                )}
                            </span>{" "}
                            <span>
                                {this.originalString
                                    ? highlightMithril(
                                          placeholderText as string,
                                          highlight,
                                      )
                                    : placeholderText}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="FoF-Linguist-Controls">
                    {this.actions(this.attrs.onchange).toArray()}
                </div>
            </div>
        );
    }

    localeName(): Mithril.Children {
        if (this.attrs.locale) {
            return (
                <>
                    {this.attrs.locale.name + " ("}
                    <code>{this.attrs.locale.key}</code>
                    {")"}
                </>
            );
        } else {
            return app.translator.trans("fof-linguist.admin.locales.all");
        }
    }

    actions(onchange: () => void): ItemList<Mithril.Children> {
        const items = new ItemList<Mithril.Children>();

        items.add(
            "apply",
            <Button
                type="button"
                className="Button Button--primary"
                loading={this.processing}
                disabled={!this.dirty}
                onclick={() => {
                    this.saveString(onchange);
                }}
            >
                {app.translator.trans("fof-linguist.admin.buttons.apply")}
            </Button>,
        );

        items.add(
            "reset",
            <Button
                type="button"
                className="Button"
                loading={this.processing}
                disabled={!this.dirty && !this.string}
                onclick={() => {
                    this.deleteString(onchange);
                }}
            >
                {app.translator.trans("fof-linguist.admin.buttons.reset")}
            </Button>,
        );

        if (this.originalString) {
            items.add(
                "copy-original",
                <Button
                    type="button"
                    className="Button"
                    loading={this.processing}
                    onclick={() => {
                        this.value = this.originalString!;
                        this.dirty = true;
                    }}
                >
                    {app.translator.trans(
                        "fof-linguist.admin.buttons.copy-original",
                    )}
                </Button>,
            );
        }

        return items;
    }

    saveString(onchange: () => void): void {
        if (!this.value) {
            this.deleteString(onchange);
            return;
        }

        if (!this.string) {
            this.string = app.store.createRecord<TextString>(
                "fof-linguist-strings",
                {
                    attributes: {
                        key: this.attrs.stringKey.key(),
                        locale: this.localeKey,
                        value: "",
                    },
                },
            );
        }

        this.string.data.attributes!.value = this.value;

        if (!this.string.locale()) {
            delete (this.string.data.attributes as Record<string, unknown>)
                .locale;
        }

        this.processing = true;

        this.string
            .save(this.string.data.attributes as Record<string, unknown>)
            .then(() => {
                this.processing = false;
                this.dirty = false;
                onchange();
                m.redraw();
            })
            .catch((err: Error) => {
                this.processing = false;
                throw err;
            });
    }

    deleteString(onchange: () => void): void {
        if (this.string) {
            this.processing = true;

            this.string
                .delete()
                .then(() => {
                    this.processing = false;
                    this.dirty = false;
                    this.string = undefined;
                    this.value = "";
                    onchange();
                    m.redraw();
                })
                .catch((err: Error) => {
                    this.processing = false;
                    throw err;
                });
        } else {
            this.value = "";
            this.dirty = false;
        }
    }
}
