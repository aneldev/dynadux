(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("dynadux", [], factory);
	else if(typeof exports === 'object')
		exports["dynadux"] = factory();
	else
		root["dynadux"] = factory();
})(global, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/Dynadux/Dynadux.ts"
/*!********************************!*\
  !*** ./src/Dynadux/Dynadux.ts ***!
  \********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Dynadux: () => (/* binding */ Dynadux)
/* harmony export */ });
/* harmony import */ var _utils_combineMultipleReducers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/combineMultipleReducers */ "./src/utils/combineMultipleReducers.ts");
/* harmony import */ var _utils_consoleOnce__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/consoleOnce */ "./src/utils/consoleOnce.ts");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }


var Dynadux = /*#__PURE__*/function () {
  function Dynadux() {
    var _this = this;
    var _config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    _classCallCheck(this, Dynadux);
    this._config = _config;
    this._dispatches = [];
    this._isDispatching = false;
    this.addReducers = function (reducers) {
      _this._reducers = (0,_utils_combineMultipleReducers__WEBPACK_IMPORTED_MODULE_0__.combineMultipleReducers)(_this._reducers, reducers);
    };
    this.dispatch = function (action, payload) {
      var dispatchConfig = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      _this._dispatches.push({
        action: action,
        payload: payload,
        dispatchConfig: dispatchConfig
      });
      _this._dispatch();
    };
    this._onChange = function (_state, _action, _payload) {
      return undefined;
    };
    this._dispatch = function () {
      if (_this._isDispatching) return;
      _this._isDispatching = true;
      var dispatchItem = _this._dispatches.shift();
      if (!dispatchItem) {
        _this._isDispatching = false;
        return;
      }
      if (typeof dispatchItem.dispatchConfig.triggerChange !== "undefined") (0,_utils_consoleOnce__WEBPACK_IMPORTED_MODULE_1__.consoledOnce)('warn', 'Dynadux: `triggerChange` config prop is deprecated and will be not accepted on next major version. Use the `blockChange` (with the opposite logic) instead.');
      var action = dispatchItem.action,
        payload = dispatchItem.payload,
        _dispatchItem$dispatc = dispatchItem.dispatchConfig,
        _dispatchItem$dispatc2 = _dispatchItem$dispatc.blockChange,
        userBlockChange = _dispatchItem$dispatc2 === void 0 ? false : _dispatchItem$dispatc2,
        _dispatchItem$dispatc3 = _dispatchItem$dispatc.triggerChange,
        triggerChange = _dispatchItem$dispatc3 === void 0 ? true : _dispatchItem$dispatc3;
      var reducer = _this._reducers[action];
      var initialState = _this._state;
      var newState = Object.assign({}, _this._state);
      var changed = false;
      var _blockChange = userBlockChange || !triggerChange;
      var _this$_config$middlew = _this._config.middlewares,
        middlewares = _this$_config$middlew === void 0 ? [] : _this$_config$middlew;
      try {
        middlewares.filter(Boolean).forEach(function (_ref) {
          var before = _ref.before;
          if (!before) return;
          var middlewarePartialChange = before({
            action: action,
            payload: payload,
            dispatch: _this.dispatch,
            state: newState
          });
          if (!changed && !!middlewarePartialChange) changed = true;
          if (!middlewarePartialChange) return;
          newState = Object.assign(Object.assign({}, newState), middlewarePartialChange);
        });
      } catch (e) {
        console.error('Dynadux: A middleware on `before` raised an exception', e);
      }
      var reducerStart = Date.now();
      try {
        if (reducer) {
          var reducerPartialState = reducer({
            action: action,
            payload: payload,
            dispatch: _this.dispatch,
            state: newState,
            blockChange: function blockChange() {
              return _blockChange = true;
            }
          });
          if (!changed && !!reducerPartialState) changed = true;
          newState = Object.assign(Object.assign({}, _this._state), reducerPartialState);
        }
      } catch (e) {
        console.error('Dynadux: A reducer raised an exception', e);
      }
      try {
        var reducerElapsedMs = Date.now() - reducerStart;
        middlewares.filter(Boolean).forEach(function (_ref2) {
          var after = _ref2.after;
          if (!after) return;
          var middlewarePartialChange = after({
            action: action,
            payload: payload,
            dispatch: _this.dispatch,
            state: newState,
            initialState: initialState,
            changed: changed,
            reducerElapsedMs: reducerElapsedMs
          });
          if (!changed && !!middlewarePartialChange) changed = true;
          if (!middlewarePartialChange) return;
          newState = Object.assign(Object.assign({}, newState), middlewarePartialChange);
        });
      } catch (e) {
        console.error('Dynadux: A middleware on `after` raised an exception', e);
      }
      _this._state = newState;
      if (changed && !_blockChange && _this._config.onChange) _this._config.onChange(_this._state, action, payload);
      if (changed && !_blockChange) _this._onChange(_this._state, action, payload);
      if (_this._config.onDispatch) _this._config.onDispatch(action, payload);
      _this._isDispatching = false;
      _this._dispatch();
    };
    var _this$_config = this._config,
      _this$_config$initial = _this$_config.initialState,
      initialState = _this$_config$initial === void 0 ? {} : _this$_config$initial,
      _this$_config$reducer = _this$_config.reducers,
      reducers = _this$_config$reducer === void 0 ? {} : _this$_config$reducer,
      _this$_config$middlew2 = _this$_config.middlewares,
      middlewares = _this$_config$middlew2 === void 0 ? [] : _this$_config$middlew2;
    this._state = initialState;
    this._reducers = Array.isArray(reducers) ? _utils_combineMultipleReducers__WEBPACK_IMPORTED_MODULE_0__.combineMultipleReducers.apply(void 0, _toConsumableArray(reducers)) : reducers;
    middlewares.forEach(function (middleware) {
      return middleware && middleware.init && middleware.init(_this);
    });
  }
  return _createClass(Dynadux, [{
    key: "state",
    get: function get() {
      return this._state;
    }
  }, {
    key: "setSectionInitialState",
    value: function setSectionInitialState(section, sectionState) {
      this._state[section] = sectionState;
    }
  }]);
}();

/***/ },

/***/ "./src/create/convertReducersToSectionReducers.ts"
/*!********************************************************!*\
  !*** ./src/create/convertReducersToSectionReducers.ts ***!
  \********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   convertReducersToSectionReducers: () => (/* binding */ convertReducersToSectionReducers)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var convertReducersToSectionReducers = function convertReducersToSectionReducers(section, sectionReducers) {
  return Object.keys(sectionReducers).reduce(function (acc, action) {
    var originalReducer = sectionReducers[action];
    acc[action] = function (params) {
      var subPartialState = originalReducer(Object.assign(Object.assign({}, params), {
        state: params.state[section]
      })) || {};
      return Object.assign(Object.assign({}, params.state), _defineProperty({}, section, Object.assign(Object.assign({}, params.state[section]), subPartialState)));
    };
    return acc;
  }, {});
};

/***/ },

/***/ "./src/create/createSection.ts"
/*!*************************************!*\
  !*** ./src/create/createSection.ts ***!
  \*************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createSection: () => (/* binding */ createSection)
/* harmony export */ });
/* harmony import */ var _convertReducersToSectionReducers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./convertReducersToSectionReducers */ "./src/create/convertReducersToSectionReducers.ts");
/* harmony import */ var _tools_EventEmitter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../tools/EventEmitter */ "./src/tools/EventEmitter.ts");


var createSection = function createSection(_ref) {
  var dynadux = _ref.dynadux,
    createSectionConfig = _ref.createSectionConfig;
  var section = createSectionConfig.section,
    initialState = createSectionConfig.initialState,
    reducers = createSectionConfig.reducers,
    onChange = createSectionConfig.onChange;
  var sectionActions = Object.keys(reducers);
  var sectionChangeEventEmitter = new _tools_EventEmitter__WEBPACK_IMPORTED_MODULE_1__.EventEmitter();
  var dynaduxOnChange = dynadux._onChange;
  dynadux._onChange = function (state, action, payload) {
    if (sectionActions.includes(action)) {
      sectionChangeEventEmitter.trigger(state, action, payload);
      onChange === null || onChange === void 0 ? void 0 : onChange(state[section], action, payload);
    }
    dynaduxOnChange(state, action, payload);
  };
  if (dynadux.state[section]) throw new Error("dynadux: createSection: Section or root property \"".concat(section, "\" already exists, section couldn't be created."));
  dynadux.setSectionInitialState(section, initialState);
  dynadux.addReducers((0,_convertReducersToSectionReducers__WEBPACK_IMPORTED_MODULE_0__.convertReducersToSectionReducers)(section, reducers));
  return {
    get storeState() {
      return dynadux.state;
    },
    get state() {
      return dynadux.state[section];
    },
    dispatch: dynadux.dispatch,
    addChangeEventListener: function addChangeEventListener(cb) {
      return sectionChangeEventEmitter.addEventListener(cb);
    },
    removeChangeEventListener: function removeChangeEventListener(cb) {
      return sectionChangeEventEmitter.removeEventListener(cb);
    }
  };
};

/***/ },

/***/ "./src/create/createStore.ts"
/*!***********************************!*\
  !*** ./src/create/createStore.ts ***!
  \***********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createStore: () => (/* binding */ createStore)
/* harmony export */ });
/* harmony import */ var _Dynadux_Dynadux__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Dynadux/Dynadux */ "./src/Dynadux/Dynadux.ts");
/* harmony import */ var _tools_EventEmitter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../tools/EventEmitter */ "./src/tools/EventEmitter.ts");
/* harmony import */ var _createSection__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./createSection */ "./src/create/createSection.ts");



var createStore = function createStore(config) {
  var dynadux = new _Dynadux_Dynadux__WEBPACK_IMPORTED_MODULE_0__.Dynadux(config);
  var storeChangeEventEmitter = new _tools_EventEmitter__WEBPACK_IMPORTED_MODULE_1__.EventEmitter();
  var dynaduxOnChange = dynadux._onChange;
  dynadux._onChange = function (state, action, payload) {
    storeChangeEventEmitter.trigger(state, action, payload);
    dynaduxOnChange(state, action, payload);
  };
  var store = {
    get state() {
      return dynadux.state;
    },
    dispatch: dynadux.dispatch,
    addChangeEventListener: function addChangeEventListener(cb) {
      return storeChangeEventEmitter.addEventListener(cb);
    },
    removeChangeEventListener: function removeChangeEventListener(cb) {
      return storeChangeEventEmitter.removeEventListener(cb);
    },
    provider: {
      get store() {
        return store;
      },
      addChangeEventListener: function addChangeEventListener(cb) {
        return storeChangeEventEmitter.addEventListener(cb);
      },
      removeChangeEventListener: function removeChangeEventListener(cb) {
        return storeChangeEventEmitter.removeEventListener(cb);
      }
    },
    createSection: function createSection(createSectionConfig) {
      return (0,_createSection__WEBPACK_IMPORTED_MODULE_2__.createSection)({
        dynadux: dynadux,
        createSectionConfig: createSectionConfig
      });
    }
  };
  return store;
};

/***/ },

/***/ "./src/middlewares/dynaduxDebugMiddleware.ts"
/*!***************************************************!*\
  !*** ./src/middlewares/dynaduxDebugMiddleware.ts ***!
  \***************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   dynaduxDebugMiddleware: () => (/* binding */ dynaduxDebugMiddleware)
/* harmony export */ });
/* harmony import */ var _tools_global__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../tools/global */ "./src/tools/global.ts");
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }

var EDynaduxDebugMiddlewareActions;
(function (EDynaduxDebugMiddlewareActions) {
  EDynaduxDebugMiddlewareActions["SET_STATE"] = "__EDynaduxDebugMiddlewareActions__SET_STATE";
})(EDynaduxDebugMiddlewareActions || (EDynaduxDebugMiddlewareActions = {}));
var dynaduxDebugMiddleware = function dynaduxDebugMiddleware(config) {
  var _config$debuggerStore = config.debuggerStoreName,
    debuggerStoreName = _config$debuggerStore === void 0 ? '' : _config$debuggerStore,
    _config$consoleDispat = config.consoleDispatch,
    consoleDispatch = _config$consoleDispat === void 0 ? true : _config$consoleDispat,
    _config$consolePayloa = config.consolePayload,
    consolePayload = _config$consolePayloa === void 0 ? false : _config$consolePayloa,
    _config$consoleState = config.consoleState,
    consoleState = _config$consoleState === void 0 ? false : _config$consoleState,
    _config$consoleMethod = config.consoleMethod,
    consoleMethod = _config$consoleMethod === void 0 ? 'debug' : _config$consoleMethod,
    _config$consoleFilter = config.consoleFilter,
    consoleFilter = _config$consoleFilter === void 0 ? function () {
      return true;
    } : _config$consoleFilter;
  if (!debuggerStoreName) return {}; // Exit, it is disabled.
  var lastDispatch = 0;
  var _dispatch;
  var activeIndex = 0;
  var dynaduxDebugger = _tools_global__WEBPACK_IMPORTED_MODULE_0__.global[debuggerStoreName] = {
    log: [],
    dispatch: function dispatch(action, payload) {
      return _dispatch(action, payload);
    },
    get list() {
      return dynaduxDebugger.log.map(function (log) {
        return log.description;
      }).forEach(function (t) {
        return console.log(t);
      });
    },
    get listPayloads() {
      return dynaduxDebugger.log.map(function (log) {
        return [log.description, log.payload];
      }).forEach(function (t) {
        var _console;
        return (_console = console).log.apply(_console, _toConsumableArray(t));
      });
    },
    search: function search(text) {
      var textLowerCase = text.toLowerCase();
      return dynaduxDebugger.log.filter(function (item) {
        return item.description.toLowerCase().indexOf(textLowerCase) > -1;
      });
    },
    set: function set(userDispatchIndex) {
      if (userDispatchIndex === -1) {
        console.error('Nothing is dispatched yet');
        return;
      }
      var logItem = dynaduxDebugger.log[userDispatchIndex];
      if (!logItem) {
        console.error("Item ".concat(userDispatchIndex, " cannot be found"));
        return;
      }
      _dispatch(EDynaduxDebugMiddlewareActions.SET_STATE, logItem.after);
    },
    prev: function prev() {
      activeIndex--;
      if (activeIndex < 0) activeIndex = 0;
      dynaduxDebugger.set(activeIndex);
    },
    next: function next() {
      activeIndex++;
      if (activeIndex + 1 > dynaduxDebugger.log.length) activeIndex = dynaduxDebugger.log.length - 1;
      dynaduxDebugger.set(activeIndex);
    },
    now: function now() {
      activeIndex = dynaduxDebugger.log.length - 1;
      dynaduxDebugger.set(activeIndex);
    },
    get state() {
      return dynaduxDebugger.log[activeIndex].after;
    }
  };
  var middleware = {
    init: function init(store) {
      _dispatch = store.dispatch;
      // @ts-ignore
      middleware.after({
        action: 'INFO DynaduxDebugMiddleware Initial State',
        initialState: {},
        state: store.state,
        payload: {
          debugInfo: 'This is not a real dispatch, it is a log info of DynaduxDebugMiddleware.',
          debugTag: 2487602415245
        },
        dispatch: store.dispatch
      });
    },
    before: function before(_ref) {
      var action = _ref.action;
      if (action === EDynaduxDebugMiddlewareActions.SET_STATE) return;
      // If the developer travels in past, return him now
      if (activeIndex + 1 < dynaduxDebugger.log.length) {
        activeIndex = dynaduxDebugger.log.length - 1;
        return dynaduxDebugger.log[activeIndex].after;
      }
    },
    after: function after(_ref2) {
      var action = _ref2.action,
        payload = _ref2.payload,
        initialState = _ref2.initialState,
        state = _ref2.state,
        reducerElapsedMs = _ref2.reducerElapsedMs,
        changed = _ref2.changed;
      if (action === EDynaduxDebugMiddlewareActions.SET_STATE) return payload;
      var now = new Date();
      var nextIndex = dynaduxDebugger.log.length;
      activeIndex = nextIndex;
      var afterMs = function () {
        if (lastDispatch === 0) return undefined;
        return now.valueOf() - lastDispatch;
      }();
      var logItem = {
        description: [frontSpace(' ', "#".concat(nextIndex), 5), frontSpace(' ', "+".concat(duration(afterMs)), 10), frontSpace(' ', duration(reducerElapsedMs), 6), frontSpace(' ', "".concat(now.toLocaleTimeString(), ".").concat(frontSpace('0', now.getMilliseconds(), 4)), 13), action].join(' '),
        action: action,
        afterMs: afterMs,
        payload: payload,
        before: initialState,
        after: state,
        date: now,
        changed: changed
      };
      dynaduxDebugger.log.push(logItem);
      lastDispatch = now.valueOf();
      if (consoleDispatch && (!payload || payload.debugTag !== 2487602415245) && consoleFilter(action, payload)) {
        var _console2;
        // eslint-disable-next-line no-console
        (_console2 = console)[consoleMethod].apply(_console2, _toConsumableArray([[debuggerStoreName, frontSpace(' ', "#".concat(nextIndex), 5), frontSpace(' ', "+".concat(duration(afterMs)), 10), frontSpace(' ', duration(reducerElapsedMs), 6), frontSpace(' ', "".concat(now.toLocaleTimeString(), ".").concat(frontSpace('0', now.getMilliseconds(), 4)), 13), action].filter(Boolean).join(' '), consolePayload && {
          Payload: payload
        }, consoleState && {
          before: initialState,
          after: state,
          changed: changed
        }].filter(Boolean)));
      }
    }
  };
  return middleware;
};
var frontSpace = function frontSpace(spacer, content, length) {
  var text = String(content);
  if (text.length >= length) return text;
  return "".concat(Array(length).fill(spacer).join('')).concat(text).substring(-length);
};
var duration = function duration() {
  var d = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  if (d > 10000) return (d / 1000).toFixed(2) + 'sec';
  return d + 'ms';
};

/***/ },

/***/ "./src/tools/EventEmitter.ts"
/*!***********************************!*\
  !*** ./src/tools/EventEmitter.ts ***!
  \***********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EventEmitter: () => (/* binding */ EventEmitter)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
var EventEmitter = /*#__PURE__*/_createClass(function EventEmitter() {
  var _this = this;
  _classCallCheck(this, EventEmitter);
  this.callBacks = [];
  this.trigger = function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this.callBacks.forEach(function (cb) {
      return cb.apply(void 0, args);
    });
  };
  this.addEventListener = function (callback) {
    _this.callBacks.push(callback);
  };
  this.removeEventListener = function (callback) {
    _this.callBacks = _this.callBacks.filter(function (c) {
      return c !== callback;
    });
  };
});

/***/ },

/***/ "./src/tools/global.ts"
/*!*****************************!*\
  !*** ./src/tools/global.ts ***!
  \*****************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   global: () => (/* binding */ global)
/* harmony export */ });
var global = function () {
  var global;
  if (typeof window !== 'undefined') global = window;
  if (!global && typeof process !== 'undefined') global = process;
  return global;
}();

/***/ },

/***/ "./src/utils/combineMultipleReducers.ts"
/*!**********************************************!*\
  !*** ./src/utils/combineMultipleReducers.ts ***!
  \**********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   combineMultipleReducers: () => (/* binding */ combineMultipleReducers)
/* harmony export */ });
var combineMultipleReducers = function combineMultipleReducers() {
  var output = {};
  for (var _len = arguments.length, reducerDics = new Array(_len), _key = 0; _key < _len; _key++) {
    reducerDics[_key] = arguments[_key];
  }
  reducerDics.forEach(function (reducerDic) {
    Object.keys(reducerDic).forEach(function (action) {
      if (!output[action]) {
        output[action] = reducerDic[action];
        return;
      }
      var originalReducer = output[action];
      output[action] = function (params) {
        var stateA = params.state || {};
        var stateB = originalReducer(Object.assign(Object.assign({}, params), {
          state: stateA
        }));
        return reducerDic[action](Object.assign(Object.assign({}, params), {
          state: Object.assign(Object.assign({}, stateA), stateB)
        }));
      };
    });
  });
  return output;
};

/***/ },

/***/ "./src/utils/consoleOnce.ts"
/*!**********************************!*\
  !*** ./src/utils/consoleOnce.ts ***!
  \**********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   consoledOnce: () => (/* binding */ consoledOnce)
/* harmony export */ });
var consoled = {};
var consoledOnce = function consoledOnce(consoleType) {
  var _console;
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }
  var consoledKey = JSON.stringify({
    consoleType: consoleType,
    args: args
  });
  if (consoled[consoledKey]) return;
  consoled[consoledKey] = true;
  // eslint-disable-next-line no-console
  (_console = console)[consoleType].apply(_console, args);
};

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		if (!(moduleId in __webpack_modules__)) {
/******/ 			delete __webpack_module_cache__[moduleId];
/******/ 			var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Dynadux: () => (/* reexport safe */ _Dynadux_Dynadux__WEBPACK_IMPORTED_MODULE_0__.Dynadux),
/* harmony export */   createStore: () => (/* reexport safe */ _create_createStore__WEBPACK_IMPORTED_MODULE_1__.createStore),
/* harmony export */   dynaduxDebugMiddleware: () => (/* reexport safe */ _middlewares_dynaduxDebugMiddleware__WEBPACK_IMPORTED_MODULE_2__.dynaduxDebugMiddleware)
/* harmony export */ });
/* harmony import */ var _Dynadux_Dynadux__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Dynadux/Dynadux */ "./src/Dynadux/Dynadux.ts");
/* harmony import */ var _create_createStore__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./create/createStore */ "./src/create/createStore.ts");
/* harmony import */ var _middlewares_dynaduxDebugMiddleware__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./middlewares/dynaduxDebugMiddleware */ "./src/middlewares/dynaduxDebugMiddleware.ts");



})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=index.js.map