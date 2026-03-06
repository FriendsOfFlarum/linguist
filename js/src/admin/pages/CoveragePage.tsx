import app from "flarum/admin/app";
import Component, { ComponentAttrs } from "flarum/common/Component";
import Button from "flarum/common/components/Button";
import Icon from "flarum/common/components/Icon";
import type Mithril from "mithril";

import type { NamespaceEntry } from "./LinguistPage";
import localesAsArray from "../utils/localesAsArray";
import namespaceLabel from "../utils/namespaceLabel";
import frontendLabel from "../utils/frontendLabel";
import type StringKeyModel from "../models/StringKey";
import type TextString from "../models/TextString";

type ColumnMode = "locale" | "namespace";
type SpecialStyle = "full" | "low" | undefined;

export interface ICoveragePageAttrs extends ComponentAttrs {
    namespaces: NamespaceEntry[];
    frontends: string[];
    browseWithFilters: (filters: Record<string, unknown>) => void;
}

export default class CoveragePage extends Component<ICoveragePageAttrs> {
    columns!: ColumnMode;
    showAllFrontends!: boolean;
    totalPercent!: boolean;
    locale!: string | string[];

    oninit(vnode: Mithril.Vnode<ICoveragePageAttrs, this>) {
        super.oninit(vnode);

        this.columns = "locale";
        this.showAllFrontends = false;
        this.totalPercent = true;
        this.locale = [];

        const firstNonEnglishLocale = localesAsArray().find(
            (locale) => locale.key !== "en",
        );

        if (firstNonEnglishLocale) {
            this.locale = firstNonEnglishLocale.key;
        }
    }

    view(vnode: Mithril.VnodeDOM<ICoveragePageAttrs, this>): JSX.Element {
        let visibleFrontends = vnode.attrs.frontends.slice(0, 2);

        if (this.showAllFrontends) {
            visibleFrontends = vnode.attrs.frontends;
        }

        const { browseWithFilters, namespaces } = vnode.attrs;

        return (
            <>
                <div className="FoF-Linguist-Filters">
                    <div className="ButtonGroup">
                        <Button
                            className={
                                "Button" + (this.totalPercent ? " active" : "")
                            }
                            onclick={() => {
                                this.totalPercent = true;
                            }}
                        >
                            {app.translator.trans(
                                "fof-linguist.admin.coverage.total-options.percent",
                            )}
                        </Button>
                        <Button
                            className={
                                "Button" + (this.totalPercent ? " " : " active")
                            }
                            onclick={() => {
                                this.totalPercent = false;
                            }}
                        >
                            {app.translator.trans(
                                "fof-linguist.admin.coverage.total-options.count",
                            )}
                        </Button>
                    </div>
                    <div className="ButtonGroup">
                        <Button
                            className={
                                "Button" +
                                (this.columns === "locale" ? " active" : "")
                            }
                            onclick={() => {
                                this.columns = "locale";
                            }}
                        >
                            {app.translator.trans(
                                "fof-linguist.admin.coverage.column-options.locale",
                            )}
                        </Button>
                        <Button
                            className={
                                "Button" +
                                (this.columns === "namespace" ? " active" : "")
                            }
                            onclick={() => {
                                this.columns = "namespace";
                                this.showAllFrontends = false;
                            }}
                        >
                            {app.translator.trans(
                                "fof-linguist.admin.coverage.column-options.namespace",
                            )}
                        </Button>
                    </div>
                    {this.columns === "namespace" ? (
                        <div className="ButtonGroup">
                            {localesAsArray().map((locale) => (
                                <Button
                                    className={
                                        "Button" +
                                        (this.locale === locale.key
                                            ? " active"
                                            : "")
                                    }
                                    onclick={() => {
                                        if (this.locale !== locale.key) {
                                            this.locale = locale.key;
                                        }
                                    }}
                                >
                                    {locale.name + " (" + locale.key + ")"}
                                </Button>
                            ))}
                        </div>
                    ) : null}
                </div>
                <table className="FoF-Linguist-Coverage">
                    <thead>
                        <tr>
                            <th>
                                {app.translator.trans(
                                    "fof-linguist.admin.coverage.columns.namespace",
                                )}
                            </th>
                            {this.columns === "locale"
                                ? localesAsArray().map((locale) => (
                                      <th>
                                          {locale.name +
                                              " (" +
                                              locale.key +
                                              ")"}
                                      </th>
                                  ))
                                : this.showAllFrontends
                                  ? visibleFrontends.map((frontend) => (
                                        <th>{frontendLabel(frontend)}</th>
                                    ))
                                  : [
                                        <th>
                                            {app.translator.trans(
                                                "fof-linguist.admin.coverage.columns.all-except-admin",
                                            )}
                                        </th>,
                                        <th>{frontendLabel("admin")}</th>,
                                        <th>
                                            <Button
                                                className="Button"
                                                onclick={() => {
                                                    this.showAllFrontends = true;
                                                }}
                                            >
                                                {app.translator.trans(
                                                    "fof-linguist.admin.coverage.columns.all-frontends",
                                                )}
                                            </Button>
                                        </th>,
                                    ]}
                        </tr>
                    </thead>
                    <tbody>
                        {this.columns === "locale" ? (
                            <tr>
                                <td>
                                    <span className="FoF-Linguist-Coverage-Extension-Icon FoF-Linguist-Coverage-Namespace-Icon" />
                                    <span className="FoF-Linguist-Coverage-Extension-Title">
                                        {app.translator.trans(
                                            "fof-linguist.admin.coverage.all-namespaces",
                                        )}
                                    </span>
                                </td>
                                {localesAsArray().map((locale) => (
                                    <td>
                                        {this.localeCoverage(
                                            browseWithFilters,
                                            locale.key,
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ) : null}
                        {namespaces.map((namespace) => (
                            <tr>
                                <td>
                                    {namespace.extension ? (
                                        <>
                                            <span
                                                className="FoF-Linguist-Coverage-Extension-Icon"
                                                style={
                                                    namespace.extension
                                                        .icon as any
                                                }
                                            >
                                                {namespace.extension.icon ? (
                                                    <Icon
                                                        name={
                                                            (
                                                                namespace
                                                                    .extension
                                                                    .icon as any
                                                            ).name
                                                        }
                                                    />
                                                ) : (
                                                    ""
                                                )}
                                            </span>
                                            <span className="FoF-Linguist-Coverage-Extension-Title">
                                                {
                                                    namespace.extension.extra[
                                                        "flarum-extension"
                                                    ].title
                                                }
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="FoF-Linguist-Coverage-Extension-Icon FoF-Linguist-Coverage-Namespace-Icon" />
                                            <span className="FoF-Linguist-Coverage-Extension-Title">
                                                {namespaceLabel(
                                                    namespace.namespace,
                                                )}
                                            </span>
                                        </>
                                    )}
                                </td>
                                {this.columns === "locale"
                                    ? localesAsArray().map((locale) => (
                                          <td>
                                              {this.localeCoverage(
                                                  browseWithFilters,
                                                  locale.key,
                                                  namespace.namespace,
                                              )}
                                          </td>
                                      ))
                                    : this.showAllFrontends
                                      ? visibleFrontends.map((frontend) => (
                                            <td>
                                                {this.prefixCoverage(
                                                    browseWithFilters,
                                                    namespace.namespace,
                                                    frontend,
                                                )}
                                            </td>
                                        ))
                                      : [
                                            <td>
                                                {this.prefixCoverage(
                                                    browseWithFilters,
                                                    namespace.namespace,
                                                    "_all_except_admin",
                                                )}
                                            </td>,
                                            <td>
                                                {this.prefixCoverage(
                                                    browseWithFilters,
                                                    namespace.namespace,
                                                    "admin",
                                                )}
                                            </td>,
                                        ]}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </>
        );
    }

    prefixCoverage(
        browseWithFilters: (filters: Record<string, unknown>) => void,
        namespace: string,
        frontend: string,
    ): Mithril.Children {
        if (!this.locale) {
            return null;
        }

        return this.localeCoverage(
            browseWithFilters,
            this.locale as string,
            namespace,
            frontend,
        );
    }

    localeCoverage(
        browseWithFilters: (filters: Record<string, unknown>) => void,
        locale: string,
        namespace?: string,
        frontend?: string,
    ): Mithril.Children {
        const stringKeys = app.store
            .all<StringKeyModel>("fof-linguist-string-keys")
            .filter((key) => {
                if (!namespace) {
                    return true;
                }

                const parts = key.key()!.split(".");

                if (parts[0] !== namespace) {
                    return false;
                }

                if (frontend === "_all_except_admin") {
                    if (parts.length >= 2 && parts[1] === "admin") {
                        return false;
                    }
                } else if (
                    frontend &&
                    (parts.length < 2 || parts[1] !== frontend)
                ) {
                    return false;
                }

                return true;
            });

        if (stringKeys.length === 0) {
            return "-";
        }

        let customCount = 0;
        let originalCount = 0;

        stringKeys.forEach((stringKey) => {
            const customString = app.store
                .all<TextString>("fof-linguist-strings")
                .find(
                    (string) =>
                        string.key() === stringKey.key() &&
                        string.locale() === locale,
                );

            if (customString) {
                customCount++;
            } else if (stringKey.locales()!.hasOwnProperty(locale)) {
                originalCount++;
            }
        });

        const percent = Math.round(
            ((customCount + originalCount) / stringKeys.length) * 100,
        );

        let specialStyle: SpecialStyle;

        if (percent === 100) {
            specialStyle = "full";
        } else if (percent < 5) {
            specialStyle = "low";
        }

        let label: Mithril.Children;

        if (this.totalPercent) {
            label = app.translator.trans(
                "fof-linguist.admin.coverage.count.percent",
                {
                    percent: percent + "", // Keeps zero as string
                },
            );
        } else {
            label = app.translator.trans(
                "fof-linguist.admin.coverage.count.total",
                {
                    translated: customCount + originalCount + "", // Keeps zero as string
                    total: stringKeys.length,
                },
            );
        }

        return (
            <div className="FoF-Linguist-Coverage-Progress-Wrap">
                <div
                    className={
                        "FoF-Linguist-Progress" +
                        (specialStyle
                            ? " FoF-Linguist-Progress--" + specialStyle
                            : "")
                    }
                >
                    <div
                        className="FoF-Linguist-Progress-Bar"
                        style={{
                            width: Math.max(percent, 5) + "%", // Always show the progress bar even if very close to 0
                        }}
                    />
                    <div className="FoF-Linguist-Progress-Label">{label}</div>
                    <div className="FoF-Linguist-Progress-More">
                        {app.translator.trans(
                            "fof-linguist.admin.coverage.count.details",
                            {
                                total: stringKeys.length,
                                original: originalCount + "", // Cast to string to preserve zero
                                custom: customCount + "",
                            },
                        )}
                    </div>
                </div>
                <Button
                    icon="fas fa-filter"
                    className="Button Button--icon"
                    onclick={() => {
                        const options: Record<string, unknown> = {
                            missingTranslationsInLocales: [locale],
                        };

                        if (namespace) {
                            options.forExtension = namespace;
                        }

                        if (frontend) {
                            options.frontend = frontend;
                        }

                        browseWithFilters(options);
                    }}
                    title={
                        app.translator.trans(
                            "fof-linguist.admin.coverage.apply-missing-filter",
                        ) as string
                    }
                />
            </div>
        );
    }
}
