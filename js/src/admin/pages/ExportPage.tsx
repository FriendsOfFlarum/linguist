import app from "flarum/admin/app";
import Component, { ComponentAttrs } from "flarum/common/Component";
import Select from "flarum/common/components/Select";
import Switch from "flarum/common/components/Switch";
import LinkButton from "flarum/common/components/LinkButton";
import type Mithril from "mithril";

import type { NamespaceEntry } from "./LinguistPage";
import localesAsArray from "../utils/localesAsArray";
import namespaceLabel from "../utils/namespaceLabel";

export interface IExportPageAttrs extends ComponentAttrs {
    namespaces: NamespaceEntry[];
}

export default class ExportPage extends Component<IExportPageAttrs> {
    locale!: string;
    namespace!: string | null;
    includeOriginals!: boolean;
    includeAll!: boolean;
    loading!: boolean;
    output!: string;

    oninit(vnode: Mithril.Vnode<IExportPageAttrs, this>) {
        super.oninit(vnode);

        this.locale = "en";
        this.namespace = null;
        this.includeOriginals = false;
        this.includeAll = false;
        this.loading = false;
        this.output = "";

        this.fetchOutput();
    }

    view(_vnode: Mithril.VnodeDOM<IExportPageAttrs, this>): JSX.Element {
        const localeOptions: Record<string, string> = {};

        localesAsArray().forEach((locale) => {
            localeOptions[locale.key] = locale.name + " (" + locale.key + ")";
        });

        localeOptions.all = app.translator.trans(
            "fof-linguist.admin.export.locale-all",
        ) as string;

        const namespaceOptions: Record<string, string> = {
            _all: app.translator.trans(
                "fof-linguist.admin.export.namespace-all",
            ) as string,
        };

        this.attrs.namespaces.forEach((namespace) => {
            if (namespace.extension) {
                namespaceOptions[namespace.namespace] =
                    namespace.extension.extra["flarum-extension"].title;
            } else {
                namespaceOptions[namespace.namespace] = namespaceLabel(
                    namespace.namespace,
                );
            }
        });

        return (
            <>
                <h2>
                    {app.translator.trans("fof-linguist.admin.export.title")}
                </h2>
                <div className="Form-group">
                    <div className="Alert">
                        {app.translator.trans(
                            "fof-linguist.admin.export.warning",
                        )}
                    </div>
                </div>
                <div className="Form-group">
                    <label>
                        {app.translator.trans(
                            "fof-linguist.admin.export.locale",
                        )}
                    </label>
                    <Select
                        options={localeOptions}
                        value={this.locale}
                        onchange={(value: string) => {
                            this.locale = value;
                            this.fetchOutput();
                        }}
                    />
                </div>
                <div className="Form-group">
                    <label>
                        {app.translator.trans(
                            "fof-linguist.admin.export.namespace",
                        )}
                    </label>
                    <Select
                        options={namespaceOptions}
                        value={
                            this.namespace === null ? "_all" : this.namespace
                        }
                        onchange={(value: string) => {
                            this.namespace = value === "_all" ? null : value;
                            this.fetchOutput();
                        }}
                    />
                </div>
                <div className="Form-group">
                    <Switch
                        state={this.includeOriginals}
                        onchange={(value: boolean) => {
                            this.includeOriginals = value;
                            this.fetchOutput();
                        }}
                    >
                        {app.translator.trans(
                            "fof-linguist.admin.export.include-originals",
                        )}
                    </Switch>
                </div>
                <div className="Form-group">
                    <Switch
                        state={this.includeAll}
                        onchange={(value: boolean) => {
                            this.includeAll = value;
                            this.fetchOutput();
                        }}
                    >
                        {app.translator.trans(
                            "fof-linguist.admin.export.include-all",
                        )}
                    </Switch>
                </div>
                <div className="Form-group">
                    <label>
                        {app.translator.trans(
                            "fof-linguist.admin.export.output",
                        )}{" "}
                        <LinkButton
                            className="Button Button--primary"
                            href={this.exportUrl()}
                            external={true}
                            download={(this.namespace || this.locale) + ".yml"}
                        >
                            {app.translator.trans(
                                "fof-linguist.admin.export.download",
                            )}
                        </LinkButton>
                    </label>
                    <textarea
                        className="FormControl FoF-Export-Textarea"
                        readonly={true}
                        value={this.output}
                        rows={10}
                        placeholder={
                            (this.loading
                                ? app.translator.trans(
                                      "fof-linguist.admin.export.output-loading",
                                  )
                                : app.translator.trans(
                                      "fof-linguist.admin.export.output-empty",
                                  )) as string
                        }
                    />
                </div>
            </>
        );
    }

    exportUrl(): string {
        return (
            app.forum.attribute("apiUrl") +
            "/fof/linguist/export?" +
            m.buildQueryString({
                locale: this.locale,
                namespace: this.namespace,
                includeOriginals: this.includeOriginals ? "1" : "0",
                includeAll: this.includeAll ? "1" : "0",
            })
        );
    }

    fetchOutput(): void {
        this.loading = true;
        this.output = "";

        app.request<string>({
            method: "GET",
            url: this.exportUrl(),
            // Wrap in JSON so Flarum's JSON.parse deserializer returns the raw text
            modifyText: (text) => JSON.stringify(text),
        })
            .then((output) => {
                this.loading = false;
                this.output = output;
                m.redraw();
            })
            .catch((error: Error) => {
                this.loading = false;
                m.redraw();
                throw error;
            });
    }
}
