import app from "flarum/admin/app";
import Component, { ComponentAttrs } from "flarum/common/Component";
import Button from "flarum/common/components/Button";
import Select from "flarum/common/components/Select";
import Switch from "flarum/common/components/Switch";
import extractText from "flarum/common/utils/extractText";
import type Mithril from "mithril";

import localesAsArray from "../utils/localesAsArray";

interface ImportResult {
    imported: number;
    ignored: number;
    identical: number;
}

export default class ImportPage extends Component<ComponentAttrs> {
    locale!: string;
    overrideExisting!: boolean;
    input!: string;
    loading!: boolean;

    oninit(vnode: Mithril.Vnode<ComponentAttrs, this>) {
        super.oninit(vnode);

        this.locale = "en";
        this.overrideExisting = true;
        this.input = "";
        this.loading = false;
    }

    view(_vnode: Mithril.VnodeDOM<ComponentAttrs, this>): JSX.Element {
        const localeOptions: Record<string, string> = {};

        localesAsArray().forEach((locale) => {
            localeOptions[locale.key] = locale.name + " (" + locale.key + ")";
        });

        localeOptions.all = app.translator.trans(
            "fof-linguist.admin.import.locale-all",
        ) as string;

        return (
            <>
                <h2>
                    {app.translator.trans("fof-linguist.admin.import.title")}
                </h2>
                <div className="Form-group">
                    <label>
                        {app.translator.trans(
                            "fof-linguist.admin.import.input",
                        )}
                    </label>
                    <textarea
                        className="FormControl"
                        value={this.input}
                        oninput={(event: InputEvent) => {
                            this.input = (
                                event.target as HTMLTextAreaElement
                            ).value;
                        }}
                        rows={10}
                        placeholder={
                            app.translator.trans(
                                "fof-linguist.admin.import.input-placeholder",
                            ) as string
                        }
                    />
                </div>
                <div className="Form-group">
                    <label>
                        {app.translator.trans(
                            "fof-linguist.admin.import.locale",
                        )}
                    </label>
                    <Select
                        options={localeOptions}
                        value={this.locale}
                        onchange={(value: string) => {
                            this.locale = value;
                        }}
                    />
                </div>
                <div className="Form-group">
                    <Switch
                        state={this.overrideExisting}
                        onchange={(value: boolean) => {
                            this.overrideExisting = value;
                        }}
                    >
                        {app.translator.trans(
                            "fof-linguist.admin.import.override-existing",
                        )}
                    </Switch>
                </div>
                <div className="Form-group">
                    <Button
                        className="Button Button--primary"
                        onclick={() => {
                            this.loading = true;

                            app.request<ImportResult>({
                                method: "POST",
                                url:
                                    app.forum.attribute("apiUrl") +
                                    "/fof/linguist/import",
                                body: {
                                    input: this.input,
                                    locale: this.locale,
                                    ignoreExisting: !this.overrideExisting,
                                },
                            })
                                .then((data) => {
                                    this.loading = false;
                                    m.redraw();

                                    if (
                                        confirm(
                                            extractText(
                                                app.translator.trans(
                                                    this.overrideExisting
                                                        ? "fof-linguist.admin.import.results"
                                                        : "fof-linguist.admin.import.results-with-ignore",
                                                    {
                                                        imported:
                                                            data.imported + "", // Cast to string to preserve zeros
                                                        ignored:
                                                            data.ignored + "",
                                                        identical:
                                                            data.identical + "",
                                                    },
                                                ),
                                            ),
                                        )
                                    ) {
                                        window.location.reload();
                                    }
                                })
                                .catch((error: Error) => {
                                    this.loading = false;
                                    m.redraw();
                                    throw error;
                                });
                        }}
                        disabled={this.loading || !this.input}
                        loading={this.loading}
                    >
                        {app.translator.trans(
                            "fof-linguist.admin.import.submit",
                        )}
                    </Button>
                </div>
            </>
        );
    }
}
