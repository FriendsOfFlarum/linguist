'use strict';

System.register('flagrow/linguist/addLinguistStringsPane', ['flarum/extend', 'flarum/app', 'flarum/components/AdminNav', 'flarum/components/AdminLinkButton', 'flagrow/linguist/panes/LinguistStringsPane'], function (_export, _context) {
    "use strict";

    var extend, app, AdminNav, AdminLinkButton, LinguistStringsPane;

    _export('default', function () {
        // create the route
        app.routes['flagrow-linguist-strings'] = {
            path: '/flagrow/linguist',
            component: LinguistStringsPane.component()
        };

        // bind the route we created to the three dots settings button
        app.extensionSettings['flagrow-linguist'] = function () {
            return m.route(app.route('flagrow-linguist-strings'));
        };

        extend(AdminNav.prototype, 'items', function (items) {
            // add the Image Upload tab to the admin navigation menu
            items.add('flagrow-linguist-strings', AdminLinkButton.component({
                href: app.route('flagrow-linguist-strings'),
                icon: 'italic',
                children: app.translator.trans('flagrow-linguist.admin.menu.title'),
                description: app.translator.trans('flagrow-linguist.admin.menu.description')
            }));
        });
    });

    return {
        setters: [function (_flarumExtend) {
            extend = _flarumExtend.extend;
        }, function (_flarumApp) {
            app = _flarumApp.default;
        }, function (_flarumComponentsAdminNav) {
            AdminNav = _flarumComponentsAdminNav.default;
        }, function (_flarumComponentsAdminLinkButton) {
            AdminLinkButton = _flarumComponentsAdminLinkButton.default;
        }, function (_flagrowLinguistPanesLinguistStringsPane) {
            LinguistStringsPane = _flagrowLinguistPanesLinguistStringsPane.default;
        }],
        execute: function () {}
    };
});;
'use strict';

System.register('flagrow/linguist/components/StringKey', ['flarum/Component', 'flagrow/linguist/utils/localesAsArray', 'flagrow/linguist/components/StringLocale', 'flagrow/linguist/utils/highlightMithril'], function (_export, _context) {
    "use strict";

    var Component, localesAsArray, StringLocale, highlightMithril, StringKey;
    return {
        setters: [function (_flarumComponent) {
            Component = _flarumComponent.default;
        }, function (_flagrowLinguistUtilsLocalesAsArray) {
            localesAsArray = _flagrowLinguistUtilsLocalesAsArray.default;
        }, function (_flagrowLinguistComponentsStringLocale) {
            StringLocale = _flagrowLinguistComponentsStringLocale.default;
        }, function (_flagrowLinguistUtilsHighlightMithril) {
            highlightMithril = _flagrowLinguistUtilsHighlightMithril.default;
        }],
        execute: function () {
            StringKey = function (_Component) {
                babelHelpers.inherits(StringKey, _Component);

                function StringKey() {
                    babelHelpers.classCallCheck(this, StringKey);
                    return babelHelpers.possibleConstructorReturn(this, (StringKey.__proto__ || Object.getPrototypeOf(StringKey)).apply(this, arguments));
                }

                babelHelpers.createClass(StringKey, [{
                    key: 'view',
                    value: function view() {
                        var stringKey = this.props.stringKey;
                        var highlight = this.props.highlight;

                        return m('.Flagrow-Linguist-Key', [m('.Flagrow-Linguist-Key-Code', m('code', highlightMithril(stringKey.key(), highlight))), m('.Flagrow-Linguist-Locales', [localesAsArray().map(function (locale) {
                            return m(StringLocale, {
                                key: locale.key,
                                locale: locale,
                                stringKey: stringKey,
                                highlight: highlight
                            });
                        }), m(StringLocale, {
                            key: 'all',
                            locale: null,
                            stringKey: stringKey,
                            highlight: highlight
                        })])]);
                    }
                }]);
                return StringKey;
            }(Component);

            _export('default', StringKey);
        }
    };
});;
'use strict';

System.register('flagrow/linguist/components/StringLocale', ['flarum/app', 'flarum/Component', 'flarum/utils/ItemList', 'flarum/components/Button', 'flagrow/linguist/utils/highlightMithril'], function (_export, _context) {
    "use strict";

    var app, Component, ItemList, Button, highlightMithril, StringLocale;
    return {
        setters: [function (_flarumApp) {
            app = _flarumApp.default;
        }, function (_flarumComponent) {
            Component = _flarumComponent.default;
        }, function (_flarumUtilsItemList) {
            ItemList = _flarumUtilsItemList.default;
        }, function (_flarumComponentsButton) {
            Button = _flarumComponentsButton.default;
        }, function (_flagrowLinguistUtilsHighlightMithril) {
            highlightMithril = _flagrowLinguistUtilsHighlightMithril.default;
        }],
        execute: function () {
            StringLocale = function (_Component) {
                babelHelpers.inherits(StringLocale, _Component);

                function StringLocale() {
                    babelHelpers.classCallCheck(this, StringLocale);
                    return babelHelpers.possibleConstructorReturn(this, (StringLocale.__proto__ || Object.getPrototypeOf(StringLocale)).apply(this, arguments));
                }

                babelHelpers.createClass(StringLocale, [{
                    key: 'init',
                    value: function init() {
                        var _this2 = this;

                        this.stringKey = this.props.stringKey;
                        this.locale = this.props.locale;
                        this.localeKey = this.locale ? this.locale.key : null;
                        this.originalString = this.localeKey && this.stringKey.locales().hasOwnProperty(this.localeKey) ? this.stringKey.locales()[this.localeKey] : null;

                        this.string = app.store.all('flagrow-linguist-string').find(function (string) {
                            return string.key() === _this2.stringKey.key() && string.locale() === _this2.localeKey;
                        });

                        this.value = this.string ? this.string.value() : '';
                        this.dirty = false;
                        this.processing = false;

                        this.inputType = 'input';

                        if (this.value.indexOf('\n') !== -1 || this.originalString && this.originalString.indexOf('\n') !== -1) {
                            this.inputType = 'textarea';
                        }
                    }
                }, {
                    key: 'view',
                    value: function view() {
                        var _this3 = this;

                        var placeholderText = this.originalString ? this.originalString : '(' + app.translator.trans('flagrow-linguist.admin.placeholder.' + (this.localeKey ? 'not-translated' : 'all-locales')) + ')';

                        return m('.Flagrow-Linguist-Locale', [m('label.Flagrow-Linguist-Label', this.localeName()), m('.Flagrow-Linguist-Field', {
                            className: (this.value ? 'Flagrow-Linguist-Field--with-value' : '') + (this.originalString ? ' Flagrow-Linguist-Field--with-original-string' : ''),
                            title: placeholderText
                        }, [m('.Flagrow-Linguist-Feld-Wrap', [m(this.inputType, {
                            className: 'FormControl Flagrow-Linguist-Input',
                            value: this.value,
                            oninput: m.withAttr('value', function (value) {
                                _this3.value = value;
                                _this3.dirty = true;

                                // Remove dirty state if the user erased his text without saving
                                if (!_this3.value && !_this3.string) {
                                    _this3.dirty = false;
                                }
                            }),
                            disabled: this.processing
                        }), m('.Flagrow-Linguist-Placeholder', [m('span.Flagrow-Linguist-Placeholder-Hint', app.translator.trans('flagrow-linguist.admin.placeholder.hint')), ' ', m('span', this.originalString ? highlightMithril(placeholderText, this.props.highlight) : placeholderText)])])]), m('.Flagrow-Linguist-Controls', this.actions().toArray())]);
                    }
                }, {
                    key: 'localeName',
                    value: function localeName() {
                        if (this.locale) {
                            return [this.locale.name + ' (', m('code', this.locale.key), ')'];
                        } else {
                            return app.translator.trans('flagrow-linguist.admin.locales.all');
                        }
                    }
                }, {
                    key: 'actions',
                    value: function actions() {
                        var _this4 = this;

                        var items = new ItemList();

                        items.add('apply', Button.component({
                            type: 'button',
                            className: 'Button Button--primary',
                            children: app.translator.trans('flagrow-linguist.admin.buttons.apply'),
                            loading: this.processing,
                            disabled: !this.dirty,
                            onclick: function onclick() {
                                _this4.saveString();
                            }
                        }));

                        items.add('reset', Button.component({
                            type: 'button',
                            className: 'Button',
                            children: app.translator.trans('flagrow-linguist.admin.buttons.reset'),
                            loading: this.processing,
                            disabled: !this.dirty && !this.string,
                            onclick: function onclick() {
                                _this4.deleteString();
                            }
                        }));

                        if (this.originalString) {
                            items.add('copy-original', Button.component({
                                type: 'button',
                                className: 'Button',
                                children: app.translator.trans('flagrow-linguist.admin.buttons.copy-original'),
                                loading: this.processing,
                                onclick: function onclick() {
                                    _this4.value = _this4.originalString;
                                    _this4.dirty = true;
                                }
                            }));
                        }

                        return items;
                    }
                }, {
                    key: 'saveString',
                    value: function saveString() {
                        var _this5 = this;

                        if (!this.value) {
                            this.deleteString();

                            return;
                        }

                        if (!this.string) {
                            this.string = app.store.createRecord('flagrow-linguist-string', {
                                attributes: {
                                    key: this.stringKey.key(),
                                    locale: this.localeKey,
                                    value: ''
                                }
                            });
                        }

                        this.string.data.attributes.value = this.value;

                        this.processing = true;

                        this.string.save(this.string.data.attributes).then(function () {
                            _this5.processing = false;
                            _this5.dirty = false;

                            m.redraw();
                        }).catch(function (err) {
                            _this5.processing = false;

                            throw err;
                        });
                    }
                }, {
                    key: 'deleteString',
                    value: function deleteString() {
                        var _this6 = this;

                        if (this.string) {
                            this.processing = true;

                            this.string.delete().then(function () {
                                _this6.processing = false;
                                _this6.dirty = false;

                                _this6.string = null;
                                _this6.value = '';

                                m.redraw();
                            }).catch(function (err) {
                                _this6.processing = false;

                                throw err;
                            });
                        } else {
                            this.value = '';
                            this.dirty = false;
                        }
                    }
                }]);
                return StringLocale;
            }(Component);

            _export('default', StringLocale);
        }
    };
});;
'use strict';

System.register('flagrow/linguist/main', ['flarum/app', 'flagrow/linguist/models/StringKey', 'flagrow/linguist/models/TextString', 'flagrow/linguist/addLinguistStringsPane'], function (_export, _context) {
    "use strict";

    var app, StringKey, TextString, addLinguistStringsPane;
    return {
        setters: [function (_flarumApp) {
            app = _flarumApp.default;
        }, function (_flagrowLinguistModelsStringKey) {
            StringKey = _flagrowLinguistModelsStringKey.default;
        }, function (_flagrowLinguistModelsTextString) {
            TextString = _flagrowLinguistModelsTextString.default;
        }, function (_flagrowLinguistAddLinguistStringsPane) {
            addLinguistStringsPane = _flagrowLinguistAddLinguistStringsPane.default;
        }],
        execute: function () {

            app.initializers.add('flagrow-linguist', function (app) {
                app.store.models['flagrow-linguist-string-key'] = StringKey;
                app.store.models['flagrow-linguist-string'] = TextString;

                addLinguistStringsPane();
            });
        }
    };
});;
'use strict';

System.register('flagrow/linguist/models/StringKey', ['flarum/Model', 'flarum/utils/mixin'], function (_export, _context) {
    "use strict";

    var Model, mixin, StringKey;
    return {
        setters: [function (_flarumModel) {
            Model = _flarumModel.default;
        }, function (_flarumUtilsMixin) {
            mixin = _flarumUtilsMixin.default;
        }],
        execute: function () {
            StringKey = function (_mixin) {
                babelHelpers.inherits(StringKey, _mixin);

                function StringKey() {
                    babelHelpers.classCallCheck(this, StringKey);
                    return babelHelpers.possibleConstructorReturn(this, (StringKey.__proto__ || Object.getPrototypeOf(StringKey)).apply(this, arguments));
                }

                return StringKey;
            }(mixin(Model, {
                key: Model.attribute('key'),
                locales: Model.attribute('locales')
            }));

            _export('default', StringKey);
        }
    };
});;
'use strict';

System.register('flagrow/linguist/models/TextString', ['flarum/Model', 'flarum/utils/mixin'], function (_export, _context) {
    "use strict";

    var Model, mixin, TextString;
    return {
        setters: [function (_flarumModel) {
            Model = _flarumModel.default;
        }, function (_flarumUtilsMixin) {
            mixin = _flarumUtilsMixin.default;
        }],
        execute: function () {
            TextString = function (_mixin) {
                babelHelpers.inherits(TextString, _mixin);

                function TextString() {
                    babelHelpers.classCallCheck(this, TextString);
                    return babelHelpers.possibleConstructorReturn(this, (TextString.__proto__ || Object.getPrototypeOf(TextString)).apply(this, arguments));
                }

                babelHelpers.createClass(TextString, [{
                    key: 'apiEndpoint',
                    value: function apiEndpoint() {
                        return '/flagrow/linguist/strings' + (this.exists ? '/' + this.data.id : '');
                    }
                }]);
                return TextString;
            }(mixin(Model, {
                key: Model.attribute('key'),
                locale: Model.attribute('locale'),
                value: Model.attribute('value')
            }));

            _export('default', TextString);
        }
    };
});;
'use strict';

System.register('flagrow/linguist/panes/LinguistStringsPane', ['flarum/app', 'flarum/Component', 'flagrow/linguist/components/StringKey', 'flarum/components/Button', 'flarum/components/Dropdown', 'flagrow/linguist/utils/localesAsArray', 'flarum/components/ExtensionsPage'], function (_export, _context) {
    "use strict";

    var app, Component, StringKey, Button, Dropdown, localesAsArray, ExtensionsPage, RESULTS_PER_PAGE, LinguistStringsPane;
    return {
        setters: [function (_flarumApp) {
            app = _flarumApp.default;
        }, function (_flarumComponent) {
            Component = _flarumComponent.default;
        }, function (_flagrowLinguistComponentsStringKey) {
            StringKey = _flagrowLinguistComponentsStringKey.default;
        }, function (_flarumComponentsButton) {
            Button = _flarumComponentsButton.default;
        }, function (_flarumComponentsDropdown) {
            Dropdown = _flarumComponentsDropdown.default;
        }, function (_flagrowLinguistUtilsLocalesAsArray) {
            localesAsArray = _flagrowLinguistUtilsLocalesAsArray.default;
        }, function (_flarumComponentsExtensionsPage) {
            ExtensionsPage = _flarumComponentsExtensionsPage.default;
        }],
        execute: function () {
            RESULTS_PER_PAGE = 20;

            LinguistStringsPane = function (_Component) {
                babelHelpers.inherits(LinguistStringsPane, _Component);

                function LinguistStringsPane() {
                    babelHelpers.classCallCheck(this, LinguistStringsPane);
                    return babelHelpers.possibleConstructorReturn(this, (LinguistStringsPane.__proto__ || Object.getPrototypeOf(LinguistStringsPane)).apply(this, arguments));
                }

                babelHelpers.createClass(LinguistStringsPane, [{
                    key: 'init',
                    value: function init() {
                        var _this2 = this;

                        this.numberOfResultsToShow = RESULTS_PER_PAGE;

                        this.filters = {
                            search: '',
                            withOwnTranslations: false,
                            withOriginalTranslationsInLocales: [],
                            withoutOriginalTranslationsInLocales: [],
                            forExtension: null
                        };

                        this.results = [];

                        this.enabledExtensions = [];

                        m.sync([app.request({
                            method: 'GET',
                            url: app.forum.attribute('apiUrl') + '/flagrow/linguist/strings'
                        }).then(function (result) {
                            app.store.pushPayload(result);
                        }), app.request({
                            method: 'GET',
                            url: app.forum.attribute('apiUrl') + '/flagrow/linguist/string-keys'
                        }).then(function (result) {
                            var keys = app.store.pushPayload(result);

                            // Construct an array with extensions that are enabled and have translations with the extension id as prefix
                            Object.keys(app.data.extensions).forEach(function (extensionId) {
                                if (ExtensionsPage.prototype.isEnabled(extensionId) && keys.findIndex(function (key) {
                                    return key.key().indexOf(extensionId + '.') === 0;
                                }) !== -1) {
                                    _this2.enabledExtensions.push(app.data.extensions[extensionId]);
                                }
                            });
                        })]).then(function () {
                            _this2.applyFilters();
                        });
                    }
                }, {
                    key: 'view',
                    value: function view() {
                        var _this3 = this;

                        var keys = this.results.slice(0, this.numberOfResultsToShow);

                        return m('.container', [m('.Flagrow-Linguist-Filters', {
                            key: 'filters'
                        }, [m('input.FormControl', {
                            key: 'search',
                            value: this.filters.search,
                            oninput: m.withAttr('value', function (value) {
                                _this3.filters.search = value;
                                _this3.applyFilters();
                            }),
                            placeholder: app.translator.trans('flagrow-linguist.admin.filters.search')
                        }), Button.component({
                            className: 'Button' + (this.filters.withOwnTranslations ? ' Flagrow-Linguist-Filter--Selected' : ''),
                            icon: this.filters.withOwnTranslations ? 'check-square-o' : 'square-o',
                            onclick: function onclick() {
                                _this3.filters.withOwnTranslations = !_this3.filters.withOwnTranslations;
                                _this3.applyFilters();
                            }
                        }, app.translator.trans('flagrow-linguist.admin.filters.with-own-translations')), Dropdown.component({
                            buttonClassName: 'Button' + (this.filters.forExtension ? ' Flagrow-Linguist-Filter--Selected' : ''),
                            label: app.translator.trans('flagrow-linguist.admin.filters.for-extension')
                        }, this.enabledExtensions.map(function (extension) {
                            return Button.component({
                                className: 'Button',
                                icon: _this3.filters.forExtension === extension.id ? 'check-square-o' : 'square-o',
                                onclick: function onclick() {
                                    if (_this3.filters.forExtension === extension.id) {
                                        _this3.filters.forExtension = null;
                                    } else {
                                        _this3.filters.forExtension = extension.id;
                                    }

                                    _this3.applyFilters();
                                }
                            }, extension.extra['flarum-extension'].title);
                        })), Dropdown.component({
                            buttonClassName: 'Button' + (this.filters.withoutOriginalTranslationsInLocales.length ? ' Flagrow-Linguist-Filter--Selected' : ''),
                            label: app.translator.trans('flagrow-linguist.admin.filters.without-original-translations-in-locales')
                        }, localesAsArray().map(function (locale) {
                            return Button.component({
                                className: 'Button',
                                icon: _this3.filters.withoutOriginalTranslationsInLocales.indexOf(locale.key) !== -1 ? 'check-square-o' : 'square-o',
                                onclick: function onclick() {
                                    if (_this3.filters.withoutOriginalTranslationsInLocales.indexOf(locale.key) !== -1) {
                                        _this3.filters.withoutOriginalTranslationsInLocales = _this3.filters.withoutOriginalTranslationsInLocales.filter(function (key) {
                                            return key !== locale.key;
                                        });
                                    } else {
                                        _this3.filters.withoutOriginalTranslationsInLocales.push(locale.key);
                                    }

                                    _this3.applyFilters();
                                }
                            }, locale.name + ' (' + locale.key + ')');
                        })), Dropdown.component({
                            buttonClassName: 'Button' + (this.filters.withOriginalTranslationsInLocales.length ? ' Flagrow-Linguist-Filter--Selected' : ''),
                            label: app.translator.trans('flagrow-linguist.admin.filters.with-original-translations-in-locales')
                        }, localesAsArray().map(function (locale) {
                            return Button.component({
                                className: 'Button',
                                icon: _this3.filters.withOriginalTranslationsInLocales.indexOf(locale.key) !== -1 ? 'check-square-o' : 'square-o',
                                onclick: function onclick() {
                                    if (_this3.filters.withOriginalTranslationsInLocales.indexOf(locale.key) !== -1) {
                                        _this3.filters.withOriginalTranslationsInLocales = _this3.filters.withOriginalTranslationsInLocales.filter(function (key) {
                                            return key !== locale.key;
                                        });
                                    } else {
                                        _this3.filters.withOriginalTranslationsInLocales.push(locale.key);
                                    }

                                    _this3.applyFilters();
                                }
                            }, locale.name + ' (' + locale.key + ')');
                        }))]), keys.map(function (stringKey) {
                            return m(StringKey, {
                                key: stringKey.id(),
                                stringKey: stringKey,
                                highlight: _this3.filters.search
                            });
                        }), m('.Flagrow-Linguist-Results', {
                            key: 'results-stats'
                        }, [app.translator.trans('flagrow-linguist.admin.filters.results', {
                            shown: keys.length + '', // cast to string otherwise number isn't displayed
                            total: this.results.length + ''
                        }), ' ', this.results.length > keys.length ? Button.component({
                            className: 'Button',
                            onclick: function onclick() {
                                _this3.numberOfResultsToShow += RESULTS_PER_PAGE;
                            }
                        }, app.translator.trans('flagrow-linguist.admin.buttons.load-more')) : null])]);
                    }
                }, {
                    key: 'applyFilters',
                    value: function applyFilters() {
                        var _this4 = this;

                        this.numberOfResultsToShow = RESULTS_PER_PAGE;

                        var keysWithCustomTranslations = app.store.all('flagrow-linguist-string').map(function (string) {
                            return string.key();
                        });

                        this.results = app.store.all('flagrow-linguist-string-key').filter(function (key) {
                            if (_this4.filters.withOwnTranslations && keysWithCustomTranslations.indexOf(key.key()) === -1) {
                                return false;
                            }

                            var _iteratorNormalCompletion = true;
                            var _didIteratorError = false;
                            var _iteratorError = undefined;

                            try {
                                for (var _iterator = _this4.filters.withOriginalTranslationsInLocales[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                                    var _locale = _step.value;

                                    if (!key.locales().hasOwnProperty(_locale)) {
                                        return false;
                                    }
                                }
                            } catch (err) {
                                _didIteratorError = true;
                                _iteratorError = err;
                            } finally {
                                try {
                                    if (!_iteratorNormalCompletion && _iterator.return) {
                                        _iterator.return();
                                    }
                                } finally {
                                    if (_didIteratorError) {
                                        throw _iteratorError;
                                    }
                                }
                            }

                            var _iteratorNormalCompletion2 = true;
                            var _didIteratorError2 = false;
                            var _iteratorError2 = undefined;

                            try {
                                for (var _iterator2 = _this4.filters.withoutOriginalTranslationsInLocales[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                                    var _locale2 = _step2.value;

                                    console.log(_locale2);
                                    if (key.locales().hasOwnProperty(_locale2)) {
                                        return false;
                                    }
                                }
                            } catch (err) {
                                _didIteratorError2 = true;
                                _iteratorError2 = err;
                            } finally {
                                try {
                                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                        _iterator2.return();
                                    }
                                } finally {
                                    if (_didIteratorError2) {
                                        throw _iteratorError2;
                                    }
                                }
                            }

                            if (_this4.filters.forExtension) {
                                if (key.key().indexOf(_this4.filters.forExtension + '.') !== 0) {
                                    return false;
                                }
                            }

                            if (_this4.filters.search) {
                                if (key.key().indexOf(_this4.filters.search) !== -1) {
                                    return true;
                                }

                                var locales = key.locales();

                                for (var locale in locales) {
                                    if (locales.hasOwnProperty(locale) && locales[locale].indexOf(_this4.filters.search) !== -1) {
                                        return true;
                                    }
                                }

                                return false;
                            }

                            return true;
                        });

                        m.redraw();
                    }
                }]);
                return LinguistStringsPane;
            }(Component);

            _export('default', LinguistStringsPane);
        }
    };
});;
'use strict';

System.register('flagrow/linguist/utils/highlightMithril', [], function (_export, _context) {
    "use strict";

    var HIGHLIGHT_DELIMITER;

    _export('default', function (string, highlight) {
        if (!highlight) {
            return string;
        }

        return string.replace(highlight, HIGHLIGHT_DELIMITER + highlight + HIGHLIGHT_DELIMITER, string).split(HIGHLIGHT_DELIMITER).map(function (text) {
            if (text === highlight) {
                return m('span.Flagrow-Linguist-Highlight', text);
            }

            return text;
        });
    });

    return {
        setters: [],
        execute: function () {
            HIGHLIGHT_DELIMITER = '<flagrow-highlight>';
        }
    };
});;
'use strict';

System.register('flagrow/linguist/utils/localesAsArray', ['flarum/app'], function (_export, _context) {
    "use strict";

    var app;

    _export('default', function () {
        var locales = [];

        for (var key in app.data.locales) {
            if (!app.data.locales.hasOwnProperty(key)) {
                continue;
            }

            locales.push({
                key: key,
                name: app.data.locales[key]
            });
        }

        return locales;
    });

    return {
        setters: [function (_flarumApp) {
            app = _flarumApp.default;
        }],
        execute: function () {}
    };
});