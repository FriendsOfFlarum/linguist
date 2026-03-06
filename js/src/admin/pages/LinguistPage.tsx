import app from "flarum/admin/app";
import ExtensionPage from "flarum/admin/components/ExtensionPage";
import LoadingIndicator from "flarum/common/components/LoadingIndicator";
import type { Extension } from "flarum/admin/AdminApplication";
import type { ApiPayloadPlural } from "flarum/common/Store";
import type StringKey from "../models/StringKey";
import type Mithril from "mithril";
import StringsPage from "./StringsPage";
import CoveragePage from "./CoveragePage";
import ExportPage from "./ExportPage";
import ImportPage from "./ImportPage";

type TabName = "strings" | "coverage" | "export" | "import";

export interface NamespaceEntry {
    namespace: string;
    extension?: Extension;
}

export default class LinguistPage extends ExtensionPage {
    tab!: TabName;
    ready!: boolean;
    namespaces!: NamespaceEntry[];
    frontends!: string[];
    initialBrowseFilters!: Record<string, unknown>;

    oninit(vnode: Mithril.Vnode<any, this>) {
        super.oninit(vnode);

        this.tab = "strings";
        this.ready = false;
        this.namespaces = [];
        this.frontends = ["forum", "admin", "lib", "ref", "api"];
        this.initialBrowseFilters = {};

        Promise.all([
            app
                .request({
                    method: "GET",
                    url:
                        app.forum.attribute("apiUrl") + "/fof-linguist-strings",
                })
                .then((result) => {
                    app.store.pushPayload<StringKey[]>(
                        result as ApiPayloadPlural,
                    );
                }),
            app
                .request({
                    method: "GET",
                    url:
                        app.forum.attribute("apiUrl") +
                        "/fof-linguist-string-keys",
                })
                .then((result) => {
                    const keys = app.store.pushPayload<StringKey[]>(
                        result as ApiPayloadPlural,
                    );

                    const namespaces: string[] = [];

                    keys.forEach((key) => {
                        const parts = key.key().split(".");

                        const namespace = parts[0];

                        if (
                            ["core", "validation"].indexOf(namespace) === -1 &&
                            namespaces.indexOf(namespace) === -1
                        ) {
                            namespaces.push(namespace);
                        }

                        if (parts.length > 1 && namespace !== "validation") {
                            const frontend = parts[1];

                            if (this.frontends.indexOf(frontend) === -1) {
                                this.frontends.push(frontend);
                            }
                        }
                    });

                    namespaces.sort();

                    this.namespaces = [
                        { namespace: "core" },
                        { namespace: "validation" },
                        ...namespaces.map((namespace) => {
                            let extension: Extension | undefined =
                                app.data.extensions[namespace];

                            if (!extension) {
                                extension = Object.values(
                                    app.data.extensions,
                                ).find((ext) => {
                                    const packageNameWithDash =
                                        ext.name.replace("/", "-");
                                    return namespace === packageNameWithDash;
                                });
                            }

                            return { namespace, extension };
                        }),
                    ];
                }),
        ]).then(() => {
            this.ready = true;
            m.redraw();
        });
    }

    content(_vnode: Mithril.VnodeDOM<any, this>) {
        return (
            <div className="ExtensionPage-settings">
                <div className="container">{this.contentTab()}</div>
            </div>
        );
    }

    infoItems() {
        const items = super.infoItems();

        items.add(
            "linguist-tabs",
            <ul className="FoF-Linguist-Tabs">
                {(["strings", "coverage", "export", "import"] as TabName[]).map(
                    (tab) => (
                        <li>
                            <a
                                className={this.tab === tab ? "active" : ""}
                                onclick={() => {
                                    this.tab = tab;
                                }}
                            >
                                {app.translator.trans(
                                    `fof-linguist.admin.tabs.${tab}`,
                                )}
                            </a>
                        </li>
                    ),
                )}
            </ul>,
            100,
        );

        return items;
    }

    contentTab(): Mithril.Children {
        if (!this.ready) {
            return <LoadingIndicator />;
        }

        switch (this.tab) {
            case "strings":
                return (
                    <StringsPage
                        namespaces={this.namespaces}
                        frontends={this.frontends}
                        initialBrowseFilters={this.initialBrowseFilters}
                    />
                );
            case "coverage":
                return (
                    <CoveragePage
                        namespaces={this.namespaces}
                        frontends={this.frontends}
                        browseWithFilters={(
                            filters: Record<string, unknown>,
                        ) => {
                            this.initialBrowseFilters = filters;
                            this.tab = "strings";
                        }}
                    />
                );
            case "export":
                return <ExportPage namespaces={this.namespaces} />;
            case "import":
                return <ImportPage />;
        }

        return null;
    }
}
