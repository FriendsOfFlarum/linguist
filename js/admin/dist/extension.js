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
                children: 'Linguist',
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

System.register('flagrow/linguist/components/LocaleDropdown', ['flarum/app', 'flarum/Component', 'flarum/components/Select'], function (_export, _context) {
    "use strict";

    var app, Component, Select, LocaleDropdown;
    return {
        setters: [function (_flarumApp) {
            app = _flarumApp.default;
        }, function (_flarumComponent) {
            Component = _flarumComponent.default;
        }, function (_flarumComponentsSelect) {
            Select = _flarumComponentsSelect.default;
        }],
        execute: function () {
            LocaleDropdown = function (_Component) {
                babelHelpers.inherits(LocaleDropdown, _Component);

                function LocaleDropdown() {
                    babelHelpers.classCallCheck(this, LocaleDropdown);
                    return babelHelpers.possibleConstructorReturn(this, (LocaleDropdown.__proto__ || Object.getPrototypeOf(LocaleDropdown)).apply(this, arguments));
                }

                babelHelpers.createClass(LocaleDropdown, [{
                    key: 'init',
                    value: function init() {
                        this.options = {
                            all: app.translator.trans('flagrow-linguist.admin.locales.all')
                        };

                        for (var locale in app.data.locales) {
                            if (!app.data.locales.hasOwnProperty(locale)) {
                                continue;
                            }

                            this.options[locale] = app.data.locales[locale] + ' (' + locale + ')';
                        }
                    }
                }, {
                    key: 'view',
                    value: function view() {
                        var _this2 = this;

                        return Select.component({
                            options: this.options,
                            value: this.props.value === null ? 'all' : this.props.value,
                            onchange: function onchange(locale) {
                                if (locale === 'all') {
                                    _this2.props.onchange(null);
                                } else {
                                    _this2.props.onchange(locale);
                                }
                            }
                        });
                    }
                }]);
                return LocaleDropdown;
            }(Component);

            _export('default', LocaleDropdown);
        }
    };
});;
'use strict';

System.register('flagrow/linguist/components/StringEdit', ['flarum/app', 'flarum/Component', 'flarum/components/Button', 'flagrow/linguist/components/LocaleDropdown', 'flagrow/linguist/components/TranslationKeyInput'], function (_export, _context) {
    "use strict";

    var app, Component, Button, LocaleDropdown, TranslationKeyInput, StringEdit;
    return {
        setters: [function (_flarumApp) {
            app = _flarumApp.default;
        }, function (_flarumComponent) {
            Component = _flarumComponent.default;
        }, function (_flarumComponentsButton) {
            Button = _flarumComponentsButton.default;
        }, function (_flagrowLinguistComponentsLocaleDropdown) {
            LocaleDropdown = _flagrowLinguistComponentsLocaleDropdown.default;
        }, function (_flagrowLinguistComponentsTranslationKeyInput) {
            TranslationKeyInput = _flagrowLinguistComponentsTranslationKeyInput.default;
        }],
        execute: function () {
            StringEdit = function (_Component) {
                babelHelpers.inherits(StringEdit, _Component);

                function StringEdit() {
                    babelHelpers.classCallCheck(this, StringEdit);
                    return babelHelpers.possibleConstructorReturn(this, (StringEdit.__proto__ || Object.getPrototypeOf(StringEdit)).apply(this, arguments));
                }

                babelHelpers.createClass(StringEdit, [{
                    key: 'init',
                    value: function init() {
                        this.textString = this.props.textString;
                        this.dirty = false;
                        this.processing = false;

                        if (this.textString === null) {
                            this.initNewString();
                        }
                    }
                }, {
                    key: 'initNewString',
                    value: function initNewString() {
                        this.textString = app.store.createRecord('flagrow-linguist-string', {
                            attributes: {
                                key: '',
                                locale: null,
                                value: ''
                            }
                        });
                    }
                }, {
                    key: 'view',
                    value: function view() {
                        return m('tr', [m('td', [TranslationKeyInput.component({
                            value: this.textString.key(),
                            onchange: this.updateAttribute.bind(this, 'key')
                        })]), m('td', [LocaleDropdown.component({
                            value: this.textString.locale(),
                            onchange: this.updateAttribute.bind(this, 'locale')
                        })]), m('td', [m('input.FormControl', {
                            value: this.textString.value(),
                            oninput: m.withAttr('value', this.updateAttribute.bind(this, 'value'))
                        })]), m('td', m('li.ButtonGroup', [Button.component({
                            type: 'submit',
                            className: 'Button Button--primary',
                            children: app.translator.trans('flagrow-linguist.admin.buttons.' + (this.textString.exists ? 'save' : 'add') + '-string'),
                            loading: this.processing,
                            disabled: !this.dirty,
                            onclick: this.saveString.bind(this)
                        }), this.textString.exists ? Button.component({
                            type: 'submit',
                            className: 'Button Button--danger',
                            children: app.translator.trans('flagrow-linguist.admin.buttons.delete-string'),
                            loading: this.processing,
                            onclick: this.deleteString.bind(this)
                        }) : '']))]);
                    }
                }, {
                    key: 'updateAttribute',
                    value: function updateAttribute(attribute, value) {
                        this.textString.pushAttributes(babelHelpers.defineProperty({}, attribute, value));

                        this.dirty = true;
                    }
                }, {
                    key: 'saveString',
                    value: function saveString() {
                        var _this2 = this;

                        this.processing = true;

                        var wasNew = !this.textString.exists;

                        this.textString.save(this.textString.data.attributes).then(function () {
                            _this2.processing = false;
                            _this2.dirty = false;

                            if (wasNew) {
                                _this2.initNewString();
                            }

                            m.redraw();
                        }).catch(function (err) {
                            _this2.processing = false;

                            throw err;
                        });
                    }
                }, {
                    key: 'deleteString',
                    value: function deleteString() {
                        var _this3 = this;

                        this.processing = true;

                        this.textString.delete().then(function () {
                            _this3.processing = false;

                            m.redraw();
                        }).catch(function (err) {
                            _this3.processing = false;

                            throw err;
                        });
                    }
                }]);
                return StringEdit;
            }(Component);

            _export('default', StringEdit);
        }
    };
});;
'use strict';

System.register('flagrow/linguist/components/TranslationKeyInput', ['flarum/app', 'flarum/Component'], function (_export, _context) {
    "use strict";

    var app, Component, TranslationKeyInput;
    return {
        setters: [function (_flarumApp) {
            app = _flarumApp.default;
        }, function (_flarumComponent) {
            Component = _flarumComponent.default;
        }],
        execute: function () {
            TranslationKeyInput = function (_Component) {
                babelHelpers.inherits(TranslationKeyInput, _Component);

                function TranslationKeyInput() {
                    babelHelpers.classCallCheck(this, TranslationKeyInput);
                    return babelHelpers.possibleConstructorReturn(this, (TranslationKeyInput.__proto__ || Object.getPrototypeOf(TranslationKeyInput)).apply(this, arguments));
                }

                babelHelpers.createClass(TranslationKeyInput, [{
                    key: 'init',
                    value: function init() {
                        this.showSuggestions = false;
                    }
                }, {
                    key: 'view',
                    value: function view() {
                        var _this2 = this;

                        return m('.Flagrow-Linguist-Autocomplete', {
                            config: this.config
                        }, [m('input.FormControl', {
                            value: this.props.value,
                            oninput: m.withAttr('value', function (value) {
                                _this2.showSuggestions = value !== '';

                                _this2.props.onchange(value);
                            }),
                            onblur: function onblur() {
                                // Timeout: Prevent dropdown from closing when clicking on it
                                window.setTimeout(function () {
                                    _this2.showSuggestions = false;

                                    m.redraw();
                                }, 200);
                            }
                        }), this.showSuggestions ? this.viewSuggestions() : null]);
                    }
                }, {
                    key: 'suggestionsForFilter',
                    value: function suggestionsForFilter() {
                        var filter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

                        var suggestions = [];

                        filter = filter.toLowerCase();

                        // It's better to not preload the list in init, because there's a good chance it won't have had time to load
                        app.store.all('flagrow-linguist-default-string').forEach(function (translation) {
                            if (filter === '' || translation.key().toLowerCase().indexOf(filter) !== -1 || translation.value().toLowerCase().indexOf(filter) !== -1) {
                                suggestions.push(translation);
                            }

                            // Show up to 10 suggestions
                            if (suggestions.length === 10) {
                                return suggestions;
                            }
                        });

                        return suggestions;
                    }
                }, {
                    key: 'viewSuggestions',
                    value: function viewSuggestions() {
                        var _this3 = this;

                        return m('ul.Flagrow-Linguist-Autocomplete--list', this.suggestionsForFilter(this.props.value).map(function (suggestion) {
                            return m('li', {
                                onclick: function onclick() {
                                    _this3.props.onchange(suggestion.key());

                                    _this3.$('input').focus();
                                }
                            }, suggestion.key() + ': ' + suggestion.value());
                        }));
                    }
                }, {
                    key: 'config',
                    value: function config(element, isInitialized, context) {
                        var _this4 = this;

                        if (isInitialized) return;

                        document.addEventListener('click', this.clickedOutside.bind(this));

                        context.onunload = function () {
                            document.removeEventListener('click', _this4.clickedOutside);
                        };
                    }
                }, {
                    key: 'clickedOutside',
                    value: function clickedOutside(event) {
                        if ($.contains(this.element, event.target)) {
                            return;
                        }

                        this.showSuggestions = false;

                        m.redraw();
                    }
                }]);
                return TranslationKeyInput;
            }(Component);

            _export('default', TranslationKeyInput);
        }
    };
});;
'use strict';

System.register('flagrow/linguist/main', ['flarum/app', 'flagrow/linguist/models/DefaultString', 'flagrow/linguist/models/TextString', 'flagrow/linguist/addLinguistStringsPane'], function (_export, _context) {
    "use strict";

    var app, DefaultString, TextString, addLinguistStringsPane;
    return {
        setters: [function (_flarumApp) {
            app = _flarumApp.default;
        }, function (_flagrowLinguistModelsDefaultString) {
            DefaultString = _flagrowLinguistModelsDefaultString.default;
        }, function (_flagrowLinguistModelsTextString) {
            TextString = _flagrowLinguistModelsTextString.default;
        }, function (_flagrowLinguistAddLinguistStringsPane) {
            addLinguistStringsPane = _flagrowLinguistAddLinguistStringsPane.default;
        }],
        execute: function () {

            app.initializers.add('flagrow-linguist', function (app) {
                app.store.models['flagrow-linguist-default-string'] = DefaultString;
                app.store.models['flagrow-linguist-string'] = TextString;

                addLinguistStringsPane();
            });
        }
    };
});;
'use strict';

System.register('flagrow/linguist/models/DefaultString', ['flarum/Model', 'flarum/utils/mixin'], function (_export, _context) {
    "use strict";

    var Model, mixin, DefaultString;
    return {
        setters: [function (_flarumModel) {
            Model = _flarumModel.default;
        }, function (_flarumUtilsMixin) {
            mixin = _flarumUtilsMixin.default;
        }],
        execute: function () {
            DefaultString = function (_mixin) {
                babelHelpers.inherits(DefaultString, _mixin);

                function DefaultString() {
                    babelHelpers.classCallCheck(this, DefaultString);
                    return babelHelpers.possibleConstructorReturn(this, (DefaultString.__proto__ || Object.getPrototypeOf(DefaultString)).apply(this, arguments));
                }

                return DefaultString;
            }(mixin(Model, {
                key: Model.attribute('key'),
                locale: Model.attribute('locale'),
                value: Model.attribute('value')
            }));

            _export('default', DefaultString);
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

System.register('flagrow/linguist/panes/LinguistStringsPane', ['flarum/app', 'flarum/Component', 'flagrow/linguist/components/StringEdit'], function (_export, _context) {
    "use strict";

    var app, Component, StringEdit, LinguistStringsPane;
    return {
        setters: [function (_flarumApp) {
            app = _flarumApp.default;
        }, function (_flarumComponent) {
            Component = _flarumComponent.default;
        }, function (_flagrowLinguistComponentsStringEdit) {
            StringEdit = _flagrowLinguistComponentsStringEdit.default;
        }],
        execute: function () {
            LinguistStringsPane = function (_Component) {
                babelHelpers.inherits(LinguistStringsPane, _Component);

                function LinguistStringsPane() {
                    babelHelpers.classCallCheck(this, LinguistStringsPane);
                    return babelHelpers.possibleConstructorReturn(this, (LinguistStringsPane.__proto__ || Object.getPrototypeOf(LinguistStringsPane)).apply(this, arguments));
                }

                babelHelpers.createClass(LinguistStringsPane, [{
                    key: 'init',
                    value: function init() {
                        app.request({
                            method: 'GET',
                            url: app.forum.attribute('apiUrl') + '/flagrow/linguist/strings'
                        }).then(function (result) {
                            app.store.pushPayload(result);
                            m.redraw();
                        });

                        app.request({
                            method: 'GET',
                            url: app.forum.attribute('apiUrl') + '/flagrow/linguist/default-strings'
                        }).then(function (result) {
                            app.store.pushPayload(result);
                            m.redraw();
                        });
                    }
                }, {
                    key: 'view',
                    value: function view() {
                        var strings = app.store.all('flagrow-linguist-string');

                        return m('.container', [m('table.Flagrow-Linguist-Strings', [m('thead', m('tr', [m('th', app.translator.trans('flagrow-linguist.admin.strings.key')), m('th', app.translator.trans('flagrow-linguist.admin.strings.locale')), m('th', app.translator.trans('flagrow-linguist.admin.strings.value'))])), m('tbody', strings.map(function (textString) {
                            return StringEdit.component({
                                key: textString.id(),
                                textString: textString
                            });
                        })), m('tbody', StringEdit.component({
                            key: 'new',
                            textString: null
                        }))])]);
                    }
                }]);
                return LinguistStringsPane;
            }(Component);

            _export('default', LinguistStringsPane);
        }
    };
});