module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./admin.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./admin.js":
/*!******************!*\
  !*** ./admin.js ***!
  \******************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _src_admin__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./src/admin */ "./src/admin/index.js");
/* empty/unused harmony star reexport */

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js":
/*!******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js ***!
  \******************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return _inheritsLoose; });
function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

/***/ }),

/***/ "./src/admin/addLinguistStringsPane.js":
/*!*********************************************!*\
  !*** ./src/admin/addLinguistStringsPane.js ***!
  \*********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var flarum_extend__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/extend */ "flarum/extend");
/* harmony import */ var flarum_extend__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_extend__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var flarum_app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/app */ "flarum/app");
/* harmony import */ var flarum_app__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_app__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_components_AdminNav__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/components/AdminNav */ "flarum/components/AdminNav");
/* harmony import */ var flarum_components_AdminNav__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_components_AdminNav__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_components_AdminLinkButton__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/components/AdminLinkButton */ "flarum/components/AdminLinkButton");
/* harmony import */ var flarum_components_AdminLinkButton__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_components_AdminLinkButton__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _panes_LinguistStringsPane__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./panes/LinguistStringsPane */ "./src/admin/panes/LinguistStringsPane.js");





/* harmony default export */ __webpack_exports__["default"] = (function () {
  // create the route
  flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.routes['flagrow-linguist-strings'] = {
    path: '/flagrow/linguist',
    component: _panes_LinguistStringsPane__WEBPACK_IMPORTED_MODULE_4__["default"].component()
  }; // bind the route we created to the three dots settings button

  flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.extensionSettings['flagrow-linguist'] = function () {
    return m.route(flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.route('flagrow-linguist-strings'));
  };

  Object(flarum_extend__WEBPACK_IMPORTED_MODULE_0__["extend"])(flarum_components_AdminNav__WEBPACK_IMPORTED_MODULE_2___default.a.prototype, 'items', function (items) {
    // add the Image Upload tab to the admin navigation menu
    items.add('flagrow-linguist-strings', flarum_components_AdminLinkButton__WEBPACK_IMPORTED_MODULE_3___default.a.component({
      href: flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.route('flagrow-linguist-strings'),
      icon: 'fas fa-italic',
      children: flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.translator.trans('flagrow-linguist.admin.menu.title'),
      description: flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.translator.trans('flagrow-linguist.admin.menu.description')
    }));
  });
});

/***/ }),

/***/ "./src/admin/components/StringKey.js":
/*!*******************************************!*\
  !*** ./src/admin/components/StringKey.js ***!
  \*******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return StringKey; });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var flarum_Component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/Component */ "flarum/Component");
/* harmony import */ var flarum_Component__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_Component__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _components_StringLocale__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../components/StringLocale */ "./src/admin/components/StringLocale.js");
/* harmony import */ var _utils_localesAsArray__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/localesAsArray */ "./src/admin/utils/localesAsArray.js");
/* harmony import */ var _utils_highlightMithril__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/highlightMithril */ "./src/admin/utils/highlightMithril.js");






var StringKey =
/*#__PURE__*/
function (_Component) {
  Object(_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(StringKey, _Component);

  function StringKey() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = StringKey.prototype;

  _proto.view = function view() {
    var stringKey = this.props.stringKey;
    var highlight = this.props.highlight;
    return m('.Flagrow-Linguist-Key', [m('.Flagrow-Linguist-Key-Code', m('code', Object(_utils_highlightMithril__WEBPACK_IMPORTED_MODULE_4__["default"])(stringKey.key(), highlight))), m('.Flagrow-Linguist-Locales', [Object(_utils_localesAsArray__WEBPACK_IMPORTED_MODULE_3__["default"])().map(function (locale) {
      return m(_components_StringLocale__WEBPACK_IMPORTED_MODULE_2__["default"], {
        key: locale.key,
        locale: locale,
        stringKey: stringKey,
        highlight: highlight
      });
    }), m(_components_StringLocale__WEBPACK_IMPORTED_MODULE_2__["default"], {
      key: 'all',
      locale: null,
      stringKey: stringKey,
      highlight: highlight
    })])]);
  };

  return StringKey;
}(flarum_Component__WEBPACK_IMPORTED_MODULE_1___default.a);



/***/ }),

/***/ "./src/admin/components/StringLocale.js":
/*!**********************************************!*\
  !*** ./src/admin/components/StringLocale.js ***!
  \**********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return StringLocale; });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var flarum_app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/app */ "flarum/app");
/* harmony import */ var flarum_app__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_app__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_Component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/Component */ "flarum/Component");
/* harmony import */ var flarum_Component__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_Component__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_utils_ItemList__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/utils/ItemList */ "flarum/utils/ItemList");
/* harmony import */ var flarum_utils_ItemList__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_utils_ItemList__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var flarum_components_Button__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! flarum/components/Button */ "flarum/components/Button");
/* harmony import */ var flarum_components_Button__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(flarum_components_Button__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _utils_highlightMithril__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utils/highlightMithril */ "./src/admin/utils/highlightMithril.js");







var StringLocale =
/*#__PURE__*/
function (_Component) {
  Object(_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(StringLocale, _Component);

  function StringLocale() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = StringLocale.prototype;

  _proto.init = function init() {
    var _this = this;

    this.stringKey = this.props.stringKey;
    this.locale = this.props.locale;
    this.localeKey = this.locale ? this.locale.key : null;
    this.originalString = this.localeKey && this.stringKey.locales().hasOwnProperty(this.localeKey) ? this.stringKey.locales()[this.localeKey] : null;
    this.string = flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.store.all('flagrow-linguist-string').find(function (string) {
      return string.key() === _this.stringKey.key() && string.locale() === _this.localeKey;
    });
    this.value = this.string ? this.string.value() : '';
    this.dirty = false;
    this.processing = false;
    this.inputType = 'input';

    if (this.value.indexOf('\n') !== -1 || this.originalString && this.originalString.indexOf('\n') !== -1) {
      this.inputType = 'textarea';
    }
  };

  _proto.view = function view() {
    var _this2 = this;

    var placeholderText = this.originalString ? this.originalString : '(' + flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.translator.trans('flagrow-linguist.admin.placeholder.' + (this.localeKey ? 'not-translated' : 'all-locales')) + ')';
    return m('.Flagrow-Linguist-Locale', [m('label.Flagrow-Linguist-Label', this.localeName()), m('.Flagrow-Linguist-Field', {
      className: (this.value ? 'Flagrow-Linguist-Field--with-value' : '') + (this.originalString ? ' Flagrow-Linguist-Field--with-original-string' : ''),
      title: placeholderText
    }, [m('.Flagrow-Linguist-Feld-Wrap', [m(this.inputType, {
      className: 'FormControl Flagrow-Linguist-Input',
      value: this.value,
      oninput: m.withAttr('value', function (value) {
        _this2.value = value;
        _this2.dirty = true; // Remove dirty state if the user erased his text without saving

        if (!_this2.value && !_this2.string) {
          _this2.dirty = false;
        }
      }),
      disabled: this.processing
    }), m('.Flagrow-Linguist-Placeholder', [m('span.Flagrow-Linguist-Placeholder-Hint', flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.translator.trans('flagrow-linguist.admin.placeholder.hint')), ' ', m('span', this.originalString ? Object(_utils_highlightMithril__WEBPACK_IMPORTED_MODULE_5__["default"])(placeholderText, this.props.highlight) : placeholderText)])])]), m('.Flagrow-Linguist-Controls', this.actions().toArray())]);
  };

  _proto.localeName = function localeName() {
    if (this.locale) {
      return [this.locale.name + ' (', m('code', this.locale.key), ')'];
    } else {
      return flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.translator.trans('flagrow-linguist.admin.locales.all');
    }
  };

  _proto.actions = function actions() {
    var _this3 = this;

    var items = new flarum_utils_ItemList__WEBPACK_IMPORTED_MODULE_3___default.a();
    items.add('apply', flarum_components_Button__WEBPACK_IMPORTED_MODULE_4___default.a.component({
      type: 'button',
      className: 'Button Button--primary',
      children: flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.translator.trans('flagrow-linguist.admin.buttons.apply'),
      loading: this.processing,
      disabled: !this.dirty,
      onclick: function onclick() {
        _this3.saveString();
      }
    }));
    items.add('reset', flarum_components_Button__WEBPACK_IMPORTED_MODULE_4___default.a.component({
      type: 'button',
      className: 'Button',
      children: flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.translator.trans('flagrow-linguist.admin.buttons.reset'),
      loading: this.processing,
      disabled: !this.dirty && !this.string,
      onclick: function onclick() {
        _this3.deleteString();
      }
    }));

    if (this.originalString) {
      items.add('copy-original', flarum_components_Button__WEBPACK_IMPORTED_MODULE_4___default.a.component({
        type: 'button',
        className: 'Button',
        children: flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.translator.trans('flagrow-linguist.admin.buttons.copy-original'),
        loading: this.processing,
        onclick: function onclick() {
          _this3.value = _this3.originalString;
          _this3.dirty = true;
        }
      }));
    }

    return items;
  };

  _proto.saveString = function saveString() {
    var _this4 = this;

    if (!this.value) {
      this.deleteString();
      return;
    }

    if (!this.string) {
      this.string = flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.store.createRecord('flagrow-linguist-string', {
        attributes: {
          key: this.stringKey.key(),
          locale: this.localeKey,
          value: ''
        }
      });
    }

    this.string.data.attributes.value = this.value;
    if (!this.string.locale()) delete this.string.data.attributes.locale;
    this.processing = true;
    this.string.save(this.string.data.attributes).then(function () {
      _this4.processing = false;
      _this4.dirty = false;
      m.redraw();
    }).catch(function (err) {
      _this4.processing = false;
      throw err;
    });
  };

  _proto.deleteString = function deleteString() {
    var _this5 = this;

    if (this.string) {
      this.processing = true;
      this.string.delete().then(function () {
        _this5.processing = false;
        _this5.dirty = false;
        _this5.string = null;
        _this5.value = '';
        m.redraw();
      }).catch(function (err) {
        _this5.processing = false;
        throw err;
      });
    } else {
      this.value = '';
      this.dirty = false;
    }
  };

  return StringLocale;
}(flarum_Component__WEBPACK_IMPORTED_MODULE_2___default.a);



/***/ }),

/***/ "./src/admin/index.js":
/*!****************************!*\
  !*** ./src/admin/index.js ***!
  \****************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var flarum_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/app */ "flarum/app");
/* harmony import */ var flarum_app__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_app__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _models_StringKey__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./models/StringKey */ "./src/admin/models/StringKey.js");
/* harmony import */ var _models_TextString__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./models/TextString */ "./src/admin/models/TextString.js");
/* harmony import */ var _addLinguistStringsPane__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./addLinguistStringsPane */ "./src/admin/addLinguistStringsPane.js");




flarum_app__WEBPACK_IMPORTED_MODULE_0___default.a.initializers.add('flagrow-linguist', function (app) {
  app.store.models['flagrow-linguist-string-key'] = _models_StringKey__WEBPACK_IMPORTED_MODULE_1__["default"];
  app.store.models['flagrow-linguist-string'] = _models_TextString__WEBPACK_IMPORTED_MODULE_2__["default"];
  Object(_addLinguistStringsPane__WEBPACK_IMPORTED_MODULE_3__["default"])();
});

/***/ }),

/***/ "./src/admin/models/StringKey.js":
/*!***************************************!*\
  !*** ./src/admin/models/StringKey.js ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return StringKey; });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var flarum_Model__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/Model */ "flarum/Model");
/* harmony import */ var flarum_Model__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_Model__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_utils_mixin__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/utils/mixin */ "flarum/utils/mixin");
/* harmony import */ var flarum_utils_mixin__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_utils_mixin__WEBPACK_IMPORTED_MODULE_2__);




var StringKey =
/*#__PURE__*/
function (_mixin) {
  Object(_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(StringKey, _mixin);

  function StringKey() {
    return _mixin.apply(this, arguments) || this;
  }

  return StringKey;
}(flarum_utils_mixin__WEBPACK_IMPORTED_MODULE_2___default()(flarum_Model__WEBPACK_IMPORTED_MODULE_1___default.a, {
  key: flarum_Model__WEBPACK_IMPORTED_MODULE_1___default.a.attribute('key'),
  locales: flarum_Model__WEBPACK_IMPORTED_MODULE_1___default.a.attribute('locales')
}));



/***/ }),

/***/ "./src/admin/models/TextString.js":
/*!****************************************!*\
  !*** ./src/admin/models/TextString.js ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return TextString; });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var flarum_Model__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/Model */ "flarum/Model");
/* harmony import */ var flarum_Model__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_Model__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_utils_mixin__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/utils/mixin */ "flarum/utils/mixin");
/* harmony import */ var flarum_utils_mixin__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_utils_mixin__WEBPACK_IMPORTED_MODULE_2__);




var TextString =
/*#__PURE__*/
function (_mixin) {
  Object(_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(TextString, _mixin);

  function TextString() {
    return _mixin.apply(this, arguments) || this;
  }

  var _proto = TextString.prototype;

  /**
   * @inheritDoc
   */
  _proto.apiEndpoint = function apiEndpoint() {
    return '/flagrow/linguist/strings' + (this.exists ? '/' + this.data.id : '');
  };

  return TextString;
}(flarum_utils_mixin__WEBPACK_IMPORTED_MODULE_2___default()(flarum_Model__WEBPACK_IMPORTED_MODULE_1___default.a, {
  key: flarum_Model__WEBPACK_IMPORTED_MODULE_1___default.a.attribute('key'),
  locale: flarum_Model__WEBPACK_IMPORTED_MODULE_1___default.a.attribute('locale'),
  value: flarum_Model__WEBPACK_IMPORTED_MODULE_1___default.a.attribute('value')
}));



/***/ }),

/***/ "./src/admin/panes/LinguistStringsPane.js":
/*!************************************************!*\
  !*** ./src/admin/panes/LinguistStringsPane.js ***!
  \************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return LinguistStringsPane; });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var flarum_app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/app */ "flarum/app");
/* harmony import */ var flarum_app__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_app__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_Component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/Component */ "flarum/Component");
/* harmony import */ var flarum_Component__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_Component__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_components_Button__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/components/Button */ "flarum/components/Button");
/* harmony import */ var flarum_components_Button__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_components_Button__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var flarum_components_Dropdown__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! flarum/components/Dropdown */ "flarum/components/Dropdown");
/* harmony import */ var flarum_components_Dropdown__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(flarum_components_Dropdown__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var flarum_components_ExtensionsPage__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! flarum/components/ExtensionsPage */ "flarum/components/ExtensionsPage");
/* harmony import */ var flarum_components_ExtensionsPage__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(flarum_components_ExtensionsPage__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _utils_localesAsArray__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../utils/localesAsArray */ "./src/admin/utils/localesAsArray.js");
/* harmony import */ var _components_StringKey__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../components/StringKey */ "./src/admin/components/StringKey.js");








var RESULTS_PER_PAGE = 20;

var LinguistStringsPane =
/*#__PURE__*/
function (_Component) {
  Object(_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(LinguistStringsPane, _Component);

  function LinguistStringsPane() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = LinguistStringsPane.prototype;

  _proto.init = function init() {
    var _this = this;

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
    m.sync([flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.request({
      method: 'GET',
      url: flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.forum.attribute('apiUrl') + '/flagrow/linguist/strings'
    }).then(function (result) {
      flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.store.pushPayload(result);
    }), flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.request({
      method: 'GET',
      url: flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.forum.attribute('apiUrl') + '/flagrow/linguist/string-keys'
    }).then(function (result) {
      var keys = flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.store.pushPayload(result); // Construct an array with extensions that are enabled and have translations with the extension id as prefix

      Object.keys(flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.data.extensions).forEach(function (extensionId) {
        if (flarum_components_ExtensionsPage__WEBPACK_IMPORTED_MODULE_5___default.a.prototype.isEnabled(extensionId) && keys.findIndex(function (key) {
          return key.key().indexOf(extensionId + '.') === 0;
        }) !== -1) {
          _this.enabledExtensions.push(flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.data.extensions[extensionId]);
        }
      });
    })]).then(function () {
      _this.applyFilters();
    });
  };

  _proto.view = function view() {
    var _this2 = this;

    var keys = this.results.slice(0, this.numberOfResultsToShow);
    return m('.container', [m('.Flagrow-Linguist-Filters', {
      key: 'filters'
    }, [m('input.FormControl', {
      key: 'search',
      value: this.filters.search,
      oninput: m.withAttr('value', function (value) {
        _this2.filters.search = value;

        _this2.applyFilters();
      }),
      placeholder: flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.translator.trans('flagrow-linguist.admin.filters.search')
    }), flarum_components_Button__WEBPACK_IMPORTED_MODULE_3___default.a.component({
      className: 'Button' + (this.filters.withOwnTranslations ? ' Flagrow-Linguist-Filter--Selected' : ''),
      icon: "far fa-" + (this.filters.withOwnTranslations ? 'check-square' : 'square'),
      onclick: function onclick() {
        _this2.filters.withOwnTranslations = !_this2.filters.withOwnTranslations;

        _this2.applyFilters();
      }
    }, flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.translator.trans('flagrow-linguist.admin.filters.with-own-translations')), flarum_components_Dropdown__WEBPACK_IMPORTED_MODULE_4___default.a.component({
      buttonClassName: 'Button' + (this.filters.forExtension ? ' Flagrow-Linguist-Filter--Selected' : ''),
      label: flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.translator.trans('flagrow-linguist.admin.filters.for-extension')
    }, this.enabledExtensions.map(function (extension) {
      return flarum_components_Button__WEBPACK_IMPORTED_MODULE_3___default.a.component({
        className: 'Button',
        icon: "far fa-" + (_this2.filters.forExtension === extension.id ? 'check-square' : 'square'),
        onclick: function onclick() {
          if (_this2.filters.forExtension === extension.id) {
            _this2.filters.forExtension = null;
          } else {
            _this2.filters.forExtension = extension.id;
          }

          _this2.applyFilters();
        }
      }, extension.extra['flarum-extension'].title);
    })), flarum_components_Dropdown__WEBPACK_IMPORTED_MODULE_4___default.a.component({
      buttonClassName: 'Button' + (this.filters.withoutOriginalTranslationsInLocales.length ? ' Flagrow-Linguist-Filter--Selected' : ''),
      label: flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.translator.trans('flagrow-linguist.admin.filters.without-original-translations-in-locales')
    }, Object(_utils_localesAsArray__WEBPACK_IMPORTED_MODULE_6__["default"])().map(function (locale) {
      return flarum_components_Button__WEBPACK_IMPORTED_MODULE_3___default.a.component({
        className: 'Button',
        icon: "far fa-" + (_this2.filters.withoutOriginalTranslationsInLocales.includes(locale.key) ? 'check-square' : 'square'),
        onclick: function onclick() {
          if (_this2.filters.withoutOriginalTranslationsInLocales.indexOf(locale.key) !== -1) {
            _this2.filters.withoutOriginalTranslationsInLocales = _this2.filters.withoutOriginalTranslationsInLocales.filter(function (key) {
              return key !== locale.key;
            });
          } else {
            _this2.filters.withoutOriginalTranslationsInLocales.push(locale.key);
          }

          _this2.applyFilters();
        }
      }, locale.name + ' (' + locale.key + ')');
    })), flarum_components_Dropdown__WEBPACK_IMPORTED_MODULE_4___default.a.component({
      buttonClassName: 'Button' + (this.filters.withOriginalTranslationsInLocales.length ? ' Flagrow-Linguist-Filter--Selected' : ''),
      label: flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.translator.trans('flagrow-linguist.admin.filters.with-original-translations-in-locales')
    }, Object(_utils_localesAsArray__WEBPACK_IMPORTED_MODULE_6__["default"])().map(function (locale) {
      return flarum_components_Button__WEBPACK_IMPORTED_MODULE_3___default.a.component({
        className: 'Button',
        icon: "far fa-" + (_this2.filters.withOriginalTranslationsInLocales.includes(locale.key) ? 'check-square' : 'square'),
        onclick: function onclick() {
          if (_this2.filters.withOriginalTranslationsInLocales.indexOf(locale.key) !== -1) {
            _this2.filters.withOriginalTranslationsInLocales = _this2.filters.withOriginalTranslationsInLocales.filter(function (key) {
              return key !== locale.key;
            });
          } else {
            _this2.filters.withOriginalTranslationsInLocales.push(locale.key);
          }

          _this2.applyFilters();
        }
      }, locale.name + ' (' + locale.key + ')');
    }))]), keys.map(function (stringKey) {
      return m(_components_StringKey__WEBPACK_IMPORTED_MODULE_7__["default"], {
        key: stringKey.id(),
        stringKey: stringKey,
        highlight: _this2.filters.search
      });
    }), m('.Flagrow-Linguist-Results', {
      key: 'results-stats'
    }, [flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.translator.trans('flagrow-linguist.admin.filters.results', {
      shown: keys.length + '',
      // cast to string otherwise number isn't displayed
      total: this.results.length + ''
    }), ' ', this.results.length > keys.length ? flarum_components_Button__WEBPACK_IMPORTED_MODULE_3___default.a.component({
      className: 'Button',
      onclick: function onclick() {
        _this2.numberOfResultsToShow += RESULTS_PER_PAGE;
      }
    }, flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.translator.trans('flagrow-linguist.admin.buttons.load-more')) : null])]);
  };

  _proto.applyFilters = function applyFilters() {
    var _this3 = this;

    this.numberOfResultsToShow = RESULTS_PER_PAGE;
    var keysWithCustomTranslations = flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.store.all('flagrow-linguist-string').map(function (string) {
      return string.key();
    });
    this.results = flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.store.all('flagrow-linguist-string-key').filter(function (key) {
      if (_this3.filters.withOwnTranslations && keysWithCustomTranslations.indexOf(key.key()) === -1) {
        return false;
      }

      for (var _iterator = _this3.filters.withOriginalTranslationsInLocales, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
        var _ref;

        if (_isArray) {
          if (_i >= _iterator.length) break;
          _ref = _iterator[_i++];
        } else {
          _i = _iterator.next();
          if (_i.done) break;
          _ref = _i.value;
        }

        var _locale = _ref;

        if (!key.locales().hasOwnProperty(_locale)) {
          return false;
        }
      }

      for (var _iterator2 = _this3.filters.withoutOriginalTranslationsInLocales, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
        var _ref2;

        if (_isArray2) {
          if (_i2 >= _iterator2.length) break;
          _ref2 = _iterator2[_i2++];
        } else {
          _i2 = _iterator2.next();
          if (_i2.done) break;
          _ref2 = _i2.value;
        }

        var _locale2 = _ref2;
        console.log(_locale2);

        if (key.locales().hasOwnProperty(_locale2)) {
          return false;
        }
      }

      if (_this3.filters.forExtension) {
        if (key.key().indexOf(_this3.filters.forExtension + '.') !== 0) {
          return false;
        }
      }

      if (_this3.filters.search) {
        if (key.key().indexOf(_this3.filters.search) !== -1) {
          return true;
        }

        var locales = key.locales();

        for (var locale in locales) {
          if (locales.hasOwnProperty(locale) && locales[locale].indexOf(_this3.filters.search) !== -1) {
            return true;
          }
        }

        return false;
      }

      return true;
    });
    m.redraw();
  };

  return LinguistStringsPane;
}(flarum_Component__WEBPACK_IMPORTED_MODULE_2___default.a);



/***/ }),

/***/ "./src/admin/utils/highlightMithril.js":
/*!*********************************************!*\
  !*** ./src/admin/utils/highlightMithril.js ***!
  \*********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var HIGHLIGHT_DELIMITER = '<flagrow-highlight>'; // Takes a string and highlight a keyword with a span with mithril template
// The output will be an array if a keyword is given

/* harmony default export */ __webpack_exports__["default"] = (function (string, highlight) {
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

/***/ }),

/***/ "./src/admin/utils/localesAsArray.js":
/*!*******************************************!*\
  !*** ./src/admin/utils/localesAsArray.js ***!
  \*******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var flarum_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/app */ "flarum/app");
/* harmony import */ var flarum_app__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_app__WEBPACK_IMPORTED_MODULE_0__);

/* harmony default export */ __webpack_exports__["default"] = (function () {
  var locales = [];

  for (var key in flarum_app__WEBPACK_IMPORTED_MODULE_0___default.a.data.locales) {
    if (!flarum_app__WEBPACK_IMPORTED_MODULE_0___default.a.data.locales.hasOwnProperty(key)) {
      continue;
    }

    locales.push({
      key: key,
      name: flarum_app__WEBPACK_IMPORTED_MODULE_0___default.a.data.locales[key]
    });
  }

  return locales;
});

/***/ }),

/***/ "flarum/Component":
/*!**************************************************!*\
  !*** external "flarum.core.compat['Component']" ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['Component'];

/***/ }),

/***/ "flarum/Model":
/*!**********************************************!*\
  !*** external "flarum.core.compat['Model']" ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['Model'];

/***/ }),

/***/ "flarum/app":
/*!********************************************!*\
  !*** external "flarum.core.compat['app']" ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['app'];

/***/ }),

/***/ "flarum/components/AdminLinkButton":
/*!*******************************************************************!*\
  !*** external "flarum.core.compat['components/AdminLinkButton']" ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['components/AdminLinkButton'];

/***/ }),

/***/ "flarum/components/AdminNav":
/*!************************************************************!*\
  !*** external "flarum.core.compat['components/AdminNav']" ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['components/AdminNav'];

/***/ }),

/***/ "flarum/components/Button":
/*!**********************************************************!*\
  !*** external "flarum.core.compat['components/Button']" ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['components/Button'];

/***/ }),

/***/ "flarum/components/Dropdown":
/*!************************************************************!*\
  !*** external "flarum.core.compat['components/Dropdown']" ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['components/Dropdown'];

/***/ }),

/***/ "flarum/components/ExtensionsPage":
/*!******************************************************************!*\
  !*** external "flarum.core.compat['components/ExtensionsPage']" ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['components/ExtensionsPage'];

/***/ }),

/***/ "flarum/extend":
/*!***********************************************!*\
  !*** external "flarum.core.compat['extend']" ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['extend'];

/***/ }),

/***/ "flarum/utils/ItemList":
/*!*******************************************************!*\
  !*** external "flarum.core.compat['utils/ItemList']" ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['utils/ItemList'];

/***/ }),

/***/ "flarum/utils/mixin":
/*!****************************************************!*\
  !*** external "flarum.core.compat['utils/mixin']" ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['utils/mixin'];

/***/ })

/******/ });
//# sourceMappingURL=admin.js.map