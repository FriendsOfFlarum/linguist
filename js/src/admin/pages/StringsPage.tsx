import app from "flarum/admin/app";
import Component, { ComponentAttrs } from "flarum/common/Component";
import Button from "flarum/common/components/Button";
import Dropdown from "flarum/common/components/Dropdown";
import Select from "flarum/common/components/Select";
import Alert from "flarum/common/components/Alert";
import LoadingModal from "flarum/admin/components/LoadingModal";
import extractText from "flarum/common/utils/extractText";
import type Mithril from "mithril";

import type { NamespaceEntry } from "./LinguistPage";
import localesAsArray from "../utils/localesAsArray";
import StringKeyComponent from "../components/StringKey";
import namespaceLabel from "../utils/namespaceLabel";
import frontendLabel from "../utils/frontendLabel";
import booleanCheck from "../utils/booleanCheck";
import type StringKeyModel from "../models/StringKey";
import type TextString from "../models/TextString";

const RESULTS_PER_PAGE = 20;

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
    numberOfResultsToShow!: number;
    filters!: Filters;
    results!: StringKeyModel[];

    oninit(vnode: Mithril.Vnode<IStringsPageAttrs, this>) {
        super.oninit(vnode);

        this.numberOfResultsToShow = RESULTS_PER_PAGE;

        this.filters = Object.assign(
            {
                search: "",
                withOwnTranslations: false,
                missingTranslationsNegation: "without",
                missingTranslationsType: "any",
                missingTranslationsOperation: "or",
                missingTranslationsInLocales: [],
                forExtension: null,
                frontend: null,
            } as Filters,
            vnode.attrs.initialBrowseFilters || {},
        );

        this.results = [];

        this.applyFilters();
    }

    view(vnode: Mithril.VnodeDOM<IStringsPageAttrs, this>): JSX.Element {
        const keys = this.results.slice(0, this.numberOfResultsToShow);
        const { namespaces, frontends } = vnode.attrs;

        return (
            <>
                {/* Additional div is used to reduce Mithril redraws as much as possible when the conditional components appear */}
                <div>{this.cacheClearInstructions()}</div>
                <div className="FoF-Linguist-Filters">
                    <input
                        className="FormControl"
                        value={this.filters.search}
                        oninput={(event: InputEvent) => {
                            this.filters.search = (
                                event.target as HTMLInputElement
                            ).value;
                            this.applyFilters();
                        }}
                        placeholder={
                            app.translator.trans(
                                "fof-linguist.admin.filters.search",
                            ) as string
                        }
                    />
                    <Button
                        className={
                            "Button" +
                            (this.filters.withOwnTranslations
                                ? " FoF-Linguist-Filter--Selected"
                                : "")
                        }
                        icon={`far fa-${this.filters.withOwnTranslations ? "check-square" : "square"}`}
                        onclick={() => {
                            this.filters.withOwnTranslations =
                                !this.filters.withOwnTranslations;
                            this.applyFilters();
                        }}
                    >
                        {app.translator.trans(
                            "fof-linguist.admin.filters.with-own-translations",
                        )}
                    </Button>
                    <Dropdown
                        buttonClassName={
                            "Button" +
                            (this.filters.forExtension
                                ? " FoF-Linguist-Filter--Selected"
                                : "")
                        }
                        label={app.translator.trans(
                            "fof-linguist.admin.filters.for-extension",
                        )}
                    >
                        {namespaces.map((namespace) => (
                            <Button
                                className="Button"
                                icon={`far fa-${this.filters.forExtension === namespace.namespace ? "dot-circle" : "circle"}`}
                                onclick={() => {
                                    if (
                                        this.filters.forExtension ===
                                        namespace.namespace
                                    ) {
                                        this.filters.forExtension = null;
                                    } else {
                                        this.filters.forExtension =
                                            namespace.namespace;
                                    }
                                    this.applyFilters();
                                }}
                            >
                                {namespace.extension
                                    ? namespace.extension.extra[
                                          "flarum-extension"
                                      ].title
                                    : namespaceLabel(namespace.namespace)}
                            </Button>
                        ))}
                    </Dropdown>
                    <Dropdown
                        buttonClassName={
                            "Button" +
                            (this.filters.frontend
                                ? " FoF-Linguist-Filter--Selected"
                                : "")
                        }
                        label={app.translator.trans(
                            "fof-linguist.admin.filters.frontend",
                        )}
                    >
                        {(["_all_except_admin", ...frontends] as string[]).map(
                            (frontend) => (
                                <Button
                                    className="Button"
                                    icon={`far fa-${this.filters.frontend === frontend ? "dot-circle" : "circle"}`}
                                    onclick={() => {
                                        if (
                                            this.filters.frontend === frontend
                                        ) {
                                            this.filters.frontend = null;
                                        } else {
                                            this.filters.frontend = frontend;
                                        }
                                        this.applyFilters();
                                    }}
                                >
                                    {frontend === "_all_except_admin"
                                        ? app.translator.trans(
                                              "fof-linguist.admin.filters.frontend-all-except-admin",
                                          )
                                        : frontendLabel(frontend)}
                                </Button>
                            ),
                        )}
                    </Dropdown>
                    <Dropdown
                        buttonClassName={
                            "Button" +
                            (this.filters.missingTranslationsInLocales.length
                                ? " FoF-Linguist-Filter--Selected"
                                : "")
                        }
                        label={app.translator.trans(
                            "fof-linguist.admin.filters.missing",
                        )}
                    >
                        <div
                            className="FoF-Linguist-Missing-Filter"
                            onclick={(event: MouseEvent) => {
                                // Prevent closing the dropdown
                                event.stopPropagation();
                            }}
                        >
                            <Select
                                value={this.filters.missingTranslationsNegation}
                                onchange={(value: string) => {
                                    this.filters.missingTranslationsNegation =
                                        value as Filters["missingTranslationsNegation"];
                                    if (
                                        this.filters
                                            .missingTranslationsInLocales.length
                                    ) {
                                        this.applyFilters();
                                    }
                                }}
                                options={{
                                    without: app.translator.trans(
                                        "fof-linguist.admin.filters.negation-options.without",
                                    ) as string,
                                    with: app.translator.trans(
                                        "fof-linguist.admin.filters.negation-options.with",
                                    ) as string,
                                }}
                            />
                            <Select
                                value={this.filters.missingTranslationsType}
                                onchange={(value: string) => {
                                    this.filters.missingTranslationsType =
                                        value as Filters["missingTranslationsType"];
                                    if (
                                        this.filters
                                            .missingTranslationsInLocales.length
                                    ) {
                                        this.applyFilters();
                                    }
                                }}
                                options={{
                                    any: app.translator.trans(
                                        "fof-linguist.admin.filters.type-options.any",
                                    ) as string,
                                    original: app.translator.trans(
                                        "fof-linguist.admin.filters.type-options.original",
                                    ) as string,
                                    own: app.translator.trans(
                                        "fof-linguist.admin.filters.type-options.own",
                                    ) as string,
                                }}
                            />
                            <p>
                                {app.translator.trans(
                                    "fof-linguist.admin.filters.missing-middle-label",
                                )}
                            </p>
                            <Select
                                value={
                                    this.filters.missingTranslationsOperation
                                }
                                onchange={(value: string) => {
                                    this.filters.missingTranslationsOperation =
                                        value as Filters["missingTranslationsOperation"];
                                    if (
                                        this.filters
                                            .missingTranslationsInLocales.length
                                    ) {
                                        this.applyFilters();
                                    }
                                }}
                                options={{
                                    or: app.translator.trans(
                                        "fof-linguist.admin.filters.operation-options.or",
                                    ) as string,
                                    and: app.translator.trans(
                                        "fof-linguist.admin.filters.operation-options.and",
                                    ) as string,
                                }}
                            />
                        </div>
                        {localesAsArray().map((locale) => (
                            <Button
                                className="Button"
                                icon={`far fa-${this.filters.missingTranslationsInLocales.indexOf(locale.key) !== -1 ? "check-square" : "square"}`}
                                onclick={() => {
                                    if (
                                        this.filters.missingTranslationsInLocales.indexOf(
                                            locale.key,
                                        ) !== -1
                                    ) {
                                        this.filters.missingTranslationsInLocales =
                                            this.filters.missingTranslationsInLocales.filter(
                                                (key) => key !== locale.key,
                                            );
                                    } else {
                                        this.filters.missingTranslationsInLocales.push(
                                            locale.key,
                                        );
                                    }
                                    this.applyFilters();
                                }}
                            >
                                {locale.name + " (" + locale.key + ")"}
                            </Button>
                        ))}
                    </Dropdown>
                    <Dropdown
                        buttonClassName="Button"
                        label={app.translator.trans(
                            "fof-linguist.admin.filters.mass-edit",
                        )}
                    >
                        <Button
                            icon="far fa-clone"
                            className="Button"
                            onclick={() => {
                                const strings = app.store
                                    .all<TextString>("fof-linguist-strings")
                                    .filter((string) => {
                                        const key =
                                            app.store.getById<StringKeyModel>(
                                                "fof-linguist-string-keys",
                                                string.key()!,
                                            );

                                        return (
                                            key &&
                                            key.locales()![string.locale()!] ===
                                                string.value()
                                        );
                                    });

                                if (
                                    confirm(
                                        extractText(
                                            app.translator.trans(
                                                "fof-linguist.admin.buttons.delete-redundant-confirm",
                                                {
                                                    count: strings.length + "",
                                                },
                                            ),
                                        ),
                                    )
                                ) {
                                    if (strings.length === 0) {
                                        return;
                                    }

                                    app.modal.show(LoadingModal);

                                    Promise.all(
                                        strings.map((string) =>
                                            string.delete(),
                                        ),
                                    ).then(() => {
                                        window.location.reload();
                                    });
                                }
                            }}
                        >
                            {app.translator.trans(
                                "fof-linguist.admin.buttons.delete-redundant",
                            )}
                        </Button>
                        <Button
                            icon="fas fa-trash"
                            className="Button"
                            onclick={() => {
                                const strings = app.store.all<TextString>(
                                    "fof-linguist-strings",
                                );

                                if (
                                    confirm(
                                        extractText(
                                            app.translator.trans(
                                                "fof-linguist.admin.buttons.delete-all-confirm",
                                                {
                                                    count: strings.length + "",
                                                },
                                            ),
                                        ),
                                    )
                                ) {
                                    if (strings.length === 0) {
                                        return;
                                    }

                                    app.modal.show(LoadingModal);

                                    Promise.all(
                                        strings.map((string) =>
                                            string.delete(),
                                        ),
                                    ).then(() => {
                                        window.location.reload();
                                    });
                                }
                            }}
                        >
                            {app.translator.trans(
                                "fof-linguist.admin.buttons.delete-all",
                            )}
                        </Button>
                    </Dropdown>
                </div>
                <div>
                    {keys.map((stringKey) => (
                        <StringKeyComponent
                            key={stringKey.id()!}
                            stringKey={stringKey}
                            highlight={this.filters.search}
                            onchange={() => {
                                // We use the setting and not a local variable because we need to preserve state
                                // if we navigate away and back to the Linguist page without refreshing the admin panel
                                app.data.settings[
                                    "fof.linguist.should-clear-cache"
                                ] = "1";
                            }}
                        />
                    ))}
                </div>
                <div className="FoF-Linguist-Results">
                    {app.translator.trans(
                        "fof-linguist.admin.filters.results",
                        {
                            shown: keys.length + "", // cast to string otherwise number isn't displayed
                            total: this.results.length + "",
                        },
                    )}{" "}
                    {this.results.length > keys.length ? (
                        <Button
                            className="Button"
                            onclick={() => {
                                this.numberOfResultsToShow += RESULTS_PER_PAGE;
                            }}
                        >
                            {app.translator.trans(
                                "fof-linguist.admin.buttons.load-more",
                            )}
                        </Button>
                    ) : null}
                </div>
            </>
        );
    }

    applyFilters(): void {
        this.numberOfResultsToShow = RESULTS_PER_PAGE;

        const keysWithCustomTranslations = app.store
            .all<TextString>("fof-linguist-strings")
            .map((string) => string.key());

        const keysWithCustomTranslationsIn: Record<
            string,
            (string | undefined)[]
        > = {};
        localesAsArray().forEach((locale) => {
            keysWithCustomTranslationsIn[locale.key] = app.store
                .all<TextString>("fof-linguist-strings")
                .filter((string) => string.locale() === locale.key)
                .map((string) => string.key());
        });

        let lowercaseSearch = "";

        if (this.filters.search) {
            lowercaseSearch = this.filters.search.toLowerCase();
        }

        this.results = app.store
            .all<StringKeyModel>("fof-linguist-string-keys")
            .filter((key) => {
                if (
                    this.filters.withOwnTranslations &&
                    keysWithCustomTranslations.indexOf(key.key()) === -1
                ) {
                    return false;
                }

                if (this.filters.missingTranslationsInLocales.length) {
                    let operation = this.filters.missingTranslationsOperation;

                    // Because the whole operation is reversed at the end based on with or without,
                    // we actually need to make the opposite boolean computation on the "has<x>" variables
                    if (
                        this.filters.missingTranslationsNegation === "without"
                    ) {
                        operation = operation === "or" ? "and" : "or";
                    }

                    const hasOriginalTranslation = booleanCheck(
                        operation,
                        this.filters.missingTranslationsInLocales.map(
                            (locale) => {
                                return key.locales()!.hasOwnProperty(locale);
                            },
                        ),
                    );
                    const hasOwnTranslation = booleanCheck(
                        operation,
                        this.filters.missingTranslationsInLocales.map(
                            (locale) => {
                                return (
                                    keysWithCustomTranslationsIn[
                                        locale
                                    ].indexOf(key.key()) !== -1
                                );
                            },
                        ),
                    );

                    let matchesType = false;

                    switch (this.filters.missingTranslationsType) {
                        case "any":
                            matchesType =
                                hasOriginalTranslation || hasOwnTranslation;
                            break;
                        case "original":
                            matchesType = hasOriginalTranslation;
                            break;
                        case "own":
                            matchesType = hasOwnTranslation;
                            break;
                    }

                    if (
                        this.filters.missingTranslationsNegation === "without"
                    ) {
                        matchesType = !matchesType;
                    }

                    if (!matchesType) {
                        return false;
                    }
                }

                if (this.filters.forExtension) {
                    if (
                        key.key()!.indexOf(this.filters.forExtension + ".") !==
                        0
                    ) {
                        return false;
                    }
                }

                if (this.filters.frontend) {
                    const parts = key.key()!.split(".");

                    if (this.filters.frontend === "_all_except_admin") {
                        // We will keep everything that isn't admin, including if it's a single level deep
                        if (parts.length >= 2 && parts[1] === "admin") {
                            return false;
                        }
                    } else {
                        // Keep only parts with 2 levels or more where second level matches frontend
                        if (
                            parts.length < 2 ||
                            parts[1] !== this.filters.frontend
                        ) {
                            return false;
                        }
                    }
                }

                if (lowercaseSearch) {
                    if (
                        key.key()!.toLowerCase().indexOf(lowercaseSearch) !== -1
                    ) {
                        return true;
                    }

                    const locales = key.locales()!;

                    for (const locale in locales) {
                        if (
                            locales.hasOwnProperty(locale) &&
                            locales[locale]
                                .toLowerCase()
                                .indexOf(lowercaseSearch) !== -1
                        ) {
                            return true;
                        }
                    }

                    return false;
                }

                return true;
            });

        m.redraw();
    }

    cacheClearInstructions(): Mithril.Children {
        // If debug is enabled, we hide the message here because even if we stop setting the flag,
        // an older flag might still be present from before debug mode was enabled
        if (app.data.debugEnabled) {
            return null;
        }

        // Check for flag that says cache should be cleared
        // This value is set both server-side and client-side in the onchange code above for immediate effect
        if (app.data.settings["fof.linguist.should-clear-cache"] !== "1") {
            return null;
        }

        return (
            <Alert
                dismissible={false}
                controls={[
                    <Button
                        className="Button Button--link"
                        onclick={() => {
                            // Same logic as in core StatusWidget
                            app.modal.show(LoadingModal);

                            app.request({
                                method: "DELETE",
                                url: app.forum.attribute("apiUrl") + "/cache",
                            }).then(() => window.location.reload());
                        }}
                    >
                        {app.translator.trans(
                            "fof-linguist.admin.clear-cache.button",
                        )}
                    </Button>,
                ]}
            >
                {app.translator.trans("fof-linguist.admin.clear-cache.text")}
            </Alert>
        );
    }
}
