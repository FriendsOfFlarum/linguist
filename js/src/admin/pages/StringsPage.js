import app from "flarum/admin/app";
import Button from "flarum/common/components/Button";
import Dropdown from "flarum/common/components/Dropdown";
import Select from "flarum/common/components/Select";
import Alert from "flarum/common/components/Alert";
import LoadingModal from "flarum/admin/components/LoadingModal";
import extractText from "flarum/common/utils/extractText";
import localesAsArray from "../utils/localesAsArray";
import StringKey from "../components/StringKey";
import namespaceLabel from "../utils/namespaceLabel";
import frontendLabel from "../utils/frontendLabel";
import booleanCheck from "../utils/booleanCheck";

/* global m */

const RESULTS_PER_PAGE = 20;

export default class StringsPage {
    oninit(vnode) {
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
            },
            vnode.attrs.initialBrowseFilters || {},
        );

        this.results = [];

        this.applyFilters();
    }

    view(vnode) {
        const keys = this.results.slice(0, this.numberOfResultsToShow);

        return [
            // Additional divs are used to reduce Mithril redraws as much as possible when the conditional components appear
            m("div", this.cacheClearInstructions()),
            m(".FoF-Linguist-Filters", [
                m("input.FormControl", {
                    value: this.filters.search,
                    oninput: (event) => {
                        this.filters.search = event.target.value;
                        this.applyFilters();
                    },
                    placeholder: app.translator.trans(
                        "fof-linguist.admin.filters.search",
                    ),
                }),
                Button.component(
                    {
                        className:
                            "Button" +
                            (this.filters.withOwnTranslations
                                ? " FoF-Linguist-Filter--Selected"
                                : ""),
                        icon: `far fa-${this.filters.withOwnTranslations ? "check-square" : "square"}`,
                        onclick: () => {
                            this.filters.withOwnTranslations =
                                !this.filters.withOwnTranslations;
                            this.applyFilters();
                        },
                    },
                    app.translator.trans(
                        "fof-linguist.admin.filters.with-own-translations",
                    ),
                ),
                Dropdown.component(
                    {
                        buttonClassName:
                            "Button" +
                            (this.filters.forExtension
                                ? " FoF-Linguist-Filter--Selected"
                                : ""),
                        label: app.translator.trans(
                            "fof-linguist.admin.filters.for-extension",
                        ),
                    },
                    vnode.attrs.namespaces.map((namespace) =>
                        Button.component(
                            {
                                className: "Button",
                                icon: `far fa-${this.filters.forExtension === namespace.namespace ? "dot-circle" : "circle"}`,
                                onclick: () => {
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
                                },
                            },
                            namespace.extension
                                ? namespace.extension.extra["flarum-extension"]
                                      .title
                                : namespaceLabel(namespace.namespace),
                        ),
                    ),
                ),
                Dropdown.component(
                    {
                        buttonClassName:
                            "Button" +
                            (this.filters.frontend
                                ? " FoF-Linguist-Filter--Selected"
                                : ""),
                        label: app.translator.trans(
                            "fof-linguist.admin.filters.frontend",
                        ),
                    },
                    ["_all_except_admin", ...vnode.attrs.frontends].map(
                        (frontend) =>
                            Button.component(
                                {
                                    className: "Button",
                                    icon: `far fa-${this.filters.frontend === frontend ? "dot-circle" : "circle"}`,
                                    onclick: () => {
                                        if (
                                            this.filters.frontend === frontend
                                        ) {
                                            this.filters.frontend = null;
                                        } else {
                                            this.filters.frontend = frontend;
                                        }

                                        this.applyFilters();
                                    },
                                },
                                frontend === "_all_except_admin"
                                    ? app.translator.trans(
                                          "fof-linguist.admin.filters.frontend-all-except-admin",
                                      )
                                    : frontendLabel(frontend),
                            ),
                    ),
                ),
                Dropdown.component(
                    {
                        buttonClassName:
                            "Button" +
                            (this.filters.missingTranslationsInLocales.length
                                ? " FoF-Linguist-Filter--Selected"
                                : ""),
                        label: app.translator.trans(
                            "fof-linguist.admin.filters.missing",
                        ),
                    },
                    [
                        m(
                            ".FoF-Linguist-Missing-Filter",
                            {
                                onclick(event) {
                                    // Prevent closing the dropdown
                                    event.stopPropagation();
                                },
                            },
                            [
                                Select.component({
                                    value: this.filters
                                        .missingTranslationsNegation,
                                    onchange: (value) => {
                                        this.filters.missingTranslationsNegation =
                                            value;

                                        if (
                                            this.filters
                                                .missingTranslationsInLocales
                                                .length
                                        ) {
                                            this.applyFilters();
                                        }
                                    },
                                    options: {
                                        without: app.translator.trans(
                                            "fof-linguist.admin.filters.negation-options.without",
                                        ),
                                        with: app.translator.trans(
                                            "fof-linguist.admin.filters.negation-options.with",
                                        ),
                                    },
                                }),
                                Select.component({
                                    value: this.filters.missingTranslationsType,
                                    onchange: (value) => {
                                        this.filters.missingTranslationsType =
                                            value;

                                        if (
                                            this.filters
                                                .missingTranslationsInLocales
                                                .length
                                        ) {
                                            this.applyFilters();
                                        }
                                    },
                                    options: {
                                        any: app.translator.trans(
                                            "fof-linguist.admin.filters.type-options.any",
                                        ),
                                        original: app.translator.trans(
                                            "fof-linguist.admin.filters.type-options.original",
                                        ),
                                        own: app.translator.trans(
                                            "fof-linguist.admin.filters.type-options.own",
                                        ),
                                    },
                                }),
                                m(
                                    "p",
                                    app.translator.trans(
                                        "fof-linguist.admin.filters.missing-middle-label",
                                    ),
                                ),
                                Select.component({
                                    value: this.filters
                                        .missingTranslationsOperation,
                                    onchange: (value) => {
                                        this.filters.missingTranslationsOperation =
                                            value;

                                        if (
                                            this.filters
                                                .missingTranslationsInLocales
                                                .length
                                        ) {
                                            this.applyFilters();
                                        }
                                    },
                                    options: {
                                        or: app.translator.trans(
                                            "fof-linguist.admin.filters.operation-options.or",
                                        ),
                                        and: app.translator.trans(
                                            "fof-linguist.admin.filters.operation-options.and",
                                        ),
                                    },
                                }),
                            ],
                        ),
                        ...localesAsArray().map((locale) =>
                            Button.component(
                                {
                                    className: "Button",
                                    icon: `far fa-${this.filters.missingTranslationsInLocales.indexOf(locale.key) !== -1 ? "check-square" : "square"}`,
                                    onclick: () => {
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
                                    },
                                },
                                locale.name + " (" + locale.key + ")",
                            ),
                        ),
                    ],
                ),
                Dropdown.component(
                    {
                        buttonClassName: "Button",
                        label: app.translator.trans(
                            "fof-linguist.admin.filters.mass-edit",
                        ),
                    },
                    [
                        Button.component(
                            {
                                icon: "far fa-clone",
                                className: "Button",
                                onclick: () => {
                                    const strings = app.store
                                        .all("fof-linguist-string")
                                        .filter((string) => {
                                            const key = app.store.getById(
                                                "fof-linguist-string-key",
                                                string.key(),
                                            );

                                            return (
                                                key &&
                                                key.locales()[
                                                    string.locale()
                                                ] === string.value()
                                            );
                                        });

                                    if (
                                        confirm(
                                            extractText(
                                                app.translator.trans(
                                                    "fof-linguist.admin.buttons.delete-redundant-confirm",
                                                    {
                                                        count:
                                                            strings.length + "",
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
                                },
                            },
                            app.translator.trans(
                                "fof-linguist.admin.buttons.delete-redundant",
                            ),
                        ),
                        Button.component(
                            {
                                icon: "fas fa-trash",
                                className: "Button",
                                onclick: () => {
                                    const strings = app.store.all(
                                        "fof-linguist-string",
                                    );

                                    if (
                                        confirm(
                                            extractText(
                                                app.translator.trans(
                                                    "fof-linguist.admin.buttons.delete-all-confirm",
                                                    {
                                                        count:
                                                            strings.length + "",
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
                                },
                            },
                            app.translator.trans(
                                "fof-linguist.admin.buttons.delete-all",
                            ),
                        ),
                    ],
                ),
            ]),
            m(
                "div",
                keys.map((stringKey) =>
                    m(StringKey, {
                        key: stringKey.id(),
                        stringKey,
                        highlight: this.filters.search,
                        onchange: () => {
                            // We use the setting and not a local variable because we need to preserve state
                            // if we navigate away and back to the Linguist page without refreshing the admin panel
                            app.data.settings[
                                "fof.linguist.should-clear-cache"
                            ] = "1";
                        },
                    }),
                ),
            ),
            m(".FoF-Linguist-Results", [
                app.translator.trans("fof-linguist.admin.filters.results", {
                    shown: keys.length + "", // cast to string otherwise number isn't displayed
                    total: this.results.length + "",
                }),
                " ",
                this.results.length > keys.length
                    ? Button.component(
                          {
                              className: "Button",
                              onclick: () => {
                                  this.numberOfResultsToShow +=
                                      RESULTS_PER_PAGE;
                              },
                          },
                          app.translator.trans(
                              "fof-linguist.admin.buttons.load-more",
                          ),
                      )
                    : null,
            ]),
        ];
    }

    applyFilters() {
        this.numberOfResultsToShow = RESULTS_PER_PAGE;

        const keysWithCustomTranslations = app.store
            .all("fof-linguist-string")
            .map((string) => string.key());

        const keysWithCustomTranslationsIn = {};
        localesAsArray().forEach((locale) => {
            keysWithCustomTranslationsIn[locale.key] = app.store
                .all("fof-linguist-string")
                .filter((string) => string.locale() === locale.key)
                .map((string) => string.key());
        });

        let lowercaseSearch = "";

        if (this.filters.search) {
            lowercaseSearch = this.filters.search.toLowerCase();
        }

        this.results = app.store
            .all("fof-linguist-string-key")
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
                                return key.locales().hasOwnProperty(locale);
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
                        key.key().indexOf(this.filters.forExtension + ".") !== 0
                    ) {
                        return false;
                    }
                }

                if (this.filters.frontend) {
                    const parts = key.key().split(".");

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
                        key.key().toLowerCase().indexOf(lowercaseSearch) !== -1
                    ) {
                        return true;
                    }

                    const locales = key.locales();

                    for (let locale in locales) {
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

    cacheClearInstructions() {
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

        return Alert.component(
            {
                dismissible: false,
                controls: [
                    Button.component(
                        {
                            className: "Button Button--link",
                            onclick() {
                                // Same logic as in core StatusWidget
                                app.modal.show(LoadingModal);

                                app.request({
                                    method: "DELETE",
                                    url:
                                        app.forum.attribute("apiUrl") +
                                        "/cache",
                                }).then(() => window.location.reload());
                            },
                        },
                        app.translator.trans(
                            "fof-linguist.admin.clear-cache.button",
                        ),
                    ),
                ],
            },
            app.translator.trans("fof-linguist.admin.clear-cache.text"),
        );
    }
}
