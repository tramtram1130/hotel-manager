/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_1__.default, options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_1__.default.locals || {});

/***/ }),
/* 2 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var isOldIE = function isOldIE() {
  var memo;
  return function memorize() {
    if (typeof memo === 'undefined') {
      // Test for IE <= 9 as proposed by Browserhacks
      // @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
      // Tests for existence of standard globals is to allow style-loader
      // to operate correctly into non-standard environments
      // @see https://github.com/webpack-contrib/style-loader/issues/177
      memo = Boolean(window && document && document.all && !window.atob);
    }

    return memo;
  };
}();

var getTarget = function getTarget() {
  var memo = {};
  return function memorize(target) {
    if (typeof memo[target] === 'undefined') {
      var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

      if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
        try {
          // This will throw an exception if access to iframe is blocked
          // due to cross-origin restrictions
          styleTarget = styleTarget.contentDocument.head;
        } catch (e) {
          // istanbul ignore next
          styleTarget = null;
        }
      }

      memo[target] = styleTarget;
    }

    return memo[target];
  };
}();

var stylesInDom = [];

function getIndexByIdentifier(identifier) {
  var result = -1;

  for (var i = 0; i < stylesInDom.length; i++) {
    if (stylesInDom[i].identifier === identifier) {
      result = i;
      break;
    }
  }

  return result;
}

function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var index = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3]
    };

    if (index !== -1) {
      stylesInDom[index].references++;
      stylesInDom[index].updater(obj);
    } else {
      stylesInDom.push({
        identifier: identifier,
        updater: addStyle(obj, options),
        references: 1
      });
    }

    identifiers.push(identifier);
  }

  return identifiers;
}

function insertStyleElement(options) {
  var style = document.createElement('style');
  var attributes = options.attributes || {};

  if (typeof attributes.nonce === 'undefined') {
    var nonce =  true ? __webpack_require__.nc : 0;

    if (nonce) {
      attributes.nonce = nonce;
    }
  }

  Object.keys(attributes).forEach(function (key) {
    style.setAttribute(key, attributes[key]);
  });

  if (typeof options.insert === 'function') {
    options.insert(style);
  } else {
    var target = getTarget(options.insert || 'head');

    if (!target) {
      throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
    }

    target.appendChild(style);
  }

  return style;
}

function removeStyleElement(style) {
  // istanbul ignore if
  if (style.parentNode === null) {
    return false;
  }

  style.parentNode.removeChild(style);
}
/* istanbul ignore next  */


var replaceText = function replaceText() {
  var textStore = [];
  return function replace(index, replacement) {
    textStore[index] = replacement;
    return textStore.filter(Boolean).join('\n');
  };
}();

function applyToSingletonTag(style, index, remove, obj) {
  var css = remove ? '' : obj.media ? "@media ".concat(obj.media, " {").concat(obj.css, "}") : obj.css; // For old IE

  /* istanbul ignore if  */

  if (style.styleSheet) {
    style.styleSheet.cssText = replaceText(index, css);
  } else {
    var cssNode = document.createTextNode(css);
    var childNodes = style.childNodes;

    if (childNodes[index]) {
      style.removeChild(childNodes[index]);
    }

    if (childNodes.length) {
      style.insertBefore(cssNode, childNodes[index]);
    } else {
      style.appendChild(cssNode);
    }
  }
}

function applyToTag(style, options, obj) {
  var css = obj.css;
  var media = obj.media;
  var sourceMap = obj.sourceMap;

  if (media) {
    style.setAttribute('media', media);
  } else {
    style.removeAttribute('media');
  }

  if (sourceMap && typeof btoa !== 'undefined') {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    while (style.firstChild) {
      style.removeChild(style.firstChild);
    }

    style.appendChild(document.createTextNode(css));
  }
}

var singleton = null;
var singletonCounter = 0;

function addStyle(obj, options) {
  var style;
  var update;
  var remove;

  if (options.singleton) {
    var styleIndex = singletonCounter++;
    style = singleton || (singleton = insertStyleElement(options));
    update = applyToSingletonTag.bind(null, style, styleIndex, false);
    remove = applyToSingletonTag.bind(null, style, styleIndex, true);
  } else {
    style = insertStyleElement(options);
    update = applyToTag.bind(null, style, options);

    remove = function remove() {
      removeStyleElement(style);
    };
  }

  update(obj);
  return function updateStyle(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap) {
        return;
      }

      update(obj = newObj);
    } else {
      remove();
    }
  };
}

module.exports = function (list, options) {
  options = options || {}; // Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
  // tags it will allow on a page

  if (!options.singleton && typeof options.singleton !== 'boolean') {
    options.singleton = isOldIE();
  }

  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];

    if (Object.prototype.toString.call(newList) !== '[object Array]') {
      return;
    }

    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDom[index].references--;
    }

    var newLastIdentifiers = modulesToDom(newList, options);

    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];

      var _index = getIndexByIdentifier(_identifier);

      if (stylesInDom[_index].references === 0) {
        stylesInDom[_index].updater();

        stylesInDom.splice(_index, 1);
      }
    }

    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),
/* 3 */
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, "* {\n  font-family: 'Noto Sans Mende Kikakui', sans-serif;\n}\n\nbody {\n  background-color: white;\n}\n\n.body-container {\n  margin: 0;\n  height: fit-content;\n}\n\n.login-container {\n  display: flex;\n  justify-content: center;\n  background-color: rgb(172, 168, 200);\n  height: 100vh;\n}\n\n.login-styling {\n  display: flex;\n  align-self: center;\n  width: 60%;\n  height: 70%;\n}\n\n.login-form-container,\n.login-art-container {\n  background-color: white;\n  height: 70vh;\n  width: 50%;\n}\n\n.no-face-image {\n  height: 100%; \n  width: 100%; \n  object-fit: cover;\n}\n\n#username,\n#password {\n  margin: 10px 0px 10px 0px;\n  width: 19.5vw;\n  border-top-style: hidden;\n  border-right-style: hidden;\n  border-left-style: hidden;\n  border-bottom-style: solid;\n  background-color: transparent;\n}\n\n.welcome-back-title {\n  margin-bottom: -2px;\n  font-size: 5vh;\n}\n\n.welcome-back-title,\n.please-enter-details-title,\n.login-label,\n#username,\n#password,\n.login-button {\n  margin-left: 3vw;\n}\n\n.login-button {\n  height: 4vh;\n  border: 0;\n  border-radius: 3px;\n  box-shadow: 0 0 15px 4px rgba(0,0,0,0.06);\n}\n\n.greeting-container {\n  display: flex;\n  justify-content: center;\n  position: relative;\n  background: linear-gradient(0deg, #00000088 30%, #ffffff44 100%);\n\n}\n\n.resort-image {\n  width: 100%;\n}\n\n.resort-name {\n  position: absolute;\n  margin-top: 3.5vw;\n  font-size: 4vw;\n  color: white;\n  font-family: 'Cinzel';\n  text-shadow: 4px 4px 10px #3d3d3d;\n}\n\n.booking-container {\n  position: absolute;\n  margin-top: 41vw;\n  background-color: white;\n  height: 12vh;\n  width: 70vw;\n  box-shadow:0 0 15px 4px rgba(0,0,0,0.06);\n}\n\n.all-forms-container {\n  height: 100%;\n  display: flex;\n  align-items: center;\n  justify-content: space-evenly;\n}\n\n.date-form-container {\n  display: flex;\n  flex-direction: column;\n}\n\n.room-form-container {\n  display: flex;\n  justify-content: space-evenly;\n  \n}\n\n.date-form, \n.room-form, \n.check-date-availability-button, \n.check-room-availability-button,\n.guest-portal-button,\n.book-button {\n  padding: 10px;\n  margin: 10px 0px 10px 0px;\n  width: 19.5vw;\n  border: 0;\n  border-radius: 3px;\n  box-shadow: 0 0 15px 4px rgba(0,0,0,0.06);\n}\n\n.login-button,\n.book-button {\n  width: 8vw;\n}\n\n.login-button,\n.check-date-availability-button, \n.check-room-availability-button,\n.guest-portal-button,\n.book-button {\n  background-color: rgb(118, 118, 118);\n  color: white;\n  transition-duration: 0.4s;\n}\n\n.login-button:hover,\n.check-date-availability-button:hover, \n.check-room-availability-button:hover,\n.guest-portal-button:hover,\n.book-button:hover {\n  background-color: #505050;\n  color: white;\n}\n\n.guest-portal-container {\n  display: flex;\n  flex-direction: column;\n}\n\n.all-bookings-container {\n  position: relative;\n  display: flex;\n  justify-content: space-evenly;\n  margin-top: 15vh;\n  padding-bottom: 5vh;\n}\n\n\n.past-bookings-container, \n.future-bookings-container {\n  background-color: white;\n  height: 30vh;\n  width: 45vw;\n  overflow-y:auto;\n  box-shadow:0 0 15px 4px rgba(0,0,0,0.06);\n}\n\n.past-bookings-title, \n.past-bookings-body, \n.future-bookings-title, \n.future-bookings-body,\n.available-rooms-title,\n.available-rooms-body,\n.booked-message-title {\n  margin: 20px 40px 20px 40px;\n}\n\n.available-rooms-title,\n.login-error-message {\n  text-align: center;\n}\n\n.spending-container-styling,\n.available-rooms-styling {\n  display: flex;\n  justify-content: center;\n}\n\n.spending-container {\n  position: relative;\n  width: 45vw;\n  display: flex;\n  justify-content: space-evenly;\n  box-shadow:0 0 15px 4px rgba(0,0,0,0.06);\n  margin-bottom: 10vh;\n}\n\n.available-rooms-container {\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  background-color: white;\n  height: fit-content;\n  width: 55vw;\n  margin-top: 15vh;\n  margin-bottom: 10vh;\n  box-shadow:0 0 15px 4px rgba(0,0,0,0.06);\n}\n\n.apology-title,\n.booked-message-title {\n  margin-top: -.7vh;\n  text-align: -webkit-center;\n}\n\n.booked-message-title {\n  margin-top: 20px;\n}\n\np,\nli {\n  margin-top: -1px;\n  margin-bottom: -1px;\n}\n\n.room-type-and-cost {\n  font-size: 2.5vh;\n}\n\n.hidden {\n  display: none;\n}", "",{"version":3,"sources":["webpack://./src/css/styles.css"],"names":[],"mappings":"AAAA;EACE,kDAAkD;AACpD;;AAEA;EACE,uBAAuB;AACzB;;AAEA;EACE,SAAS;EACT,mBAAmB;AACrB;;AAEA;EACE,aAAa;EACb,uBAAuB;EACvB,oCAAoC;EACpC,aAAa;AACf;;AAEA;EACE,aAAa;EACb,kBAAkB;EAClB,UAAU;EACV,WAAW;AACb;;AAEA;;EAEE,uBAAuB;EACvB,YAAY;EACZ,UAAU;AACZ;;AAEA;EACE,YAAY;EACZ,WAAW;EACX,iBAAiB;AACnB;;AAEA;;EAEE,yBAAyB;EACzB,aAAa;EACb,wBAAwB;EACxB,0BAA0B;EAC1B,yBAAyB;EACzB,0BAA0B;EAC1B,6BAA6B;AAC/B;;AAEA;EACE,mBAAmB;EACnB,cAAc;AAChB;;AAEA;;;;;;EAME,gBAAgB;AAClB;;AAEA;EACE,WAAW;EACX,SAAS;EACT,kBAAkB;EAClB,yCAAyC;AAC3C;;AAEA;EACE,aAAa;EACb,uBAAuB;EACvB,kBAAkB;EAClB,gEAAgE;;AAElE;;AAEA;EACE,WAAW;AACb;;AAEA;EACE,kBAAkB;EAClB,iBAAiB;EACjB,cAAc;EACd,YAAY;EACZ,qBAAqB;EACrB,iCAAiC;AACnC;;AAEA;EACE,kBAAkB;EAClB,gBAAgB;EAChB,uBAAuB;EACvB,YAAY;EACZ,WAAW;EACX,wCAAwC;AAC1C;;AAEA;EACE,YAAY;EACZ,aAAa;EACb,mBAAmB;EACnB,6BAA6B;AAC/B;;AAEA;EACE,aAAa;EACb,sBAAsB;AACxB;;AAEA;EACE,aAAa;EACb,6BAA6B;;AAE/B;;AAEA;;;;;;EAME,aAAa;EACb,yBAAyB;EACzB,aAAa;EACb,SAAS;EACT,kBAAkB;EAClB,yCAAyC;AAC3C;;AAEA;;EAEE,UAAU;AACZ;;AAEA;;;;;EAKE,oCAAoC;EACpC,YAAY;EACZ,yBAAyB;AAC3B;;AAEA;;;;;EAKE,yBAAyB;EACzB,YAAY;AACd;;AAEA;EACE,aAAa;EACb,sBAAsB;AACxB;;AAEA;EACE,kBAAkB;EAClB,aAAa;EACb,6BAA6B;EAC7B,gBAAgB;EAChB,mBAAmB;AACrB;;;AAGA;;EAEE,uBAAuB;EACvB,YAAY;EACZ,WAAW;EACX,eAAe;EACf,wCAAwC;AAC1C;;AAEA;;;;;;;EAOE,2BAA2B;AAC7B;;AAEA;;EAEE,kBAAkB;AACpB;;AAEA;;EAEE,aAAa;EACb,uBAAuB;AACzB;;AAEA;EACE,kBAAkB;EAClB,WAAW;EACX,aAAa;EACb,6BAA6B;EAC7B,wCAAwC;EACxC,mBAAmB;AACrB;;AAEA;EACE,aAAa;EACb,sBAAsB;EACtB,uBAAuB;EACvB,uBAAuB;EACvB,mBAAmB;EACnB,WAAW;EACX,gBAAgB;EAChB,mBAAmB;EACnB,wCAAwC;AAC1C;;AAEA;;EAEE,iBAAiB;EACjB,0BAA0B;AAC5B;;AAEA;EACE,gBAAgB;AAClB;;AAEA;;EAEE,gBAAgB;EAChB,mBAAmB;AACrB;;AAEA;EACE,gBAAgB;AAClB;;AAEA;EACE,aAAa;AACf","sourcesContent":["* {\n  font-family: 'Noto Sans Mende Kikakui', sans-serif;\n}\n\nbody {\n  background-color: white;\n}\n\n.body-container {\n  margin: 0;\n  height: fit-content;\n}\n\n.login-container {\n  display: flex;\n  justify-content: center;\n  background-color: rgb(172, 168, 200);\n  height: 100vh;\n}\n\n.login-styling {\n  display: flex;\n  align-self: center;\n  width: 60%;\n  height: 70%;\n}\n\n.login-form-container,\n.login-art-container {\n  background-color: white;\n  height: 70vh;\n  width: 50%;\n}\n\n.no-face-image {\n  height: 100%; \n  width: 100%; \n  object-fit: cover;\n}\n\n#username,\n#password {\n  margin: 10px 0px 10px 0px;\n  width: 19.5vw;\n  border-top-style: hidden;\n  border-right-style: hidden;\n  border-left-style: hidden;\n  border-bottom-style: solid;\n  background-color: transparent;\n}\n\n.welcome-back-title {\n  margin-bottom: -2px;\n  font-size: 5vh;\n}\n\n.welcome-back-title,\n.please-enter-details-title,\n.login-label,\n#username,\n#password,\n.login-button {\n  margin-left: 3vw;\n}\n\n.login-button {\n  height: 4vh;\n  border: 0;\n  border-radius: 3px;\n  box-shadow: 0 0 15px 4px rgba(0,0,0,0.06);\n}\n\n.greeting-container {\n  display: flex;\n  justify-content: center;\n  position: relative;\n  background: linear-gradient(0deg, #00000088 30%, #ffffff44 100%);\n\n}\n\n.resort-image {\n  width: 100%;\n}\n\n.resort-name {\n  position: absolute;\n  margin-top: 3.5vw;\n  font-size: 4vw;\n  color: white;\n  font-family: 'Cinzel';\n  text-shadow: 4px 4px 10px #3d3d3d;\n}\n\n.booking-container {\n  position: absolute;\n  margin-top: 41vw;\n  background-color: white;\n  height: 12vh;\n  width: 70vw;\n  box-shadow:0 0 15px 4px rgba(0,0,0,0.06);\n}\n\n.all-forms-container {\n  height: 100%;\n  display: flex;\n  align-items: center;\n  justify-content: space-evenly;\n}\n\n.date-form-container {\n  display: flex;\n  flex-direction: column;\n}\n\n.room-form-container {\n  display: flex;\n  justify-content: space-evenly;\n  \n}\n\n.date-form, \n.room-form, \n.check-date-availability-button, \n.check-room-availability-button,\n.guest-portal-button,\n.book-button {\n  padding: 10px;\n  margin: 10px 0px 10px 0px;\n  width: 19.5vw;\n  border: 0;\n  border-radius: 3px;\n  box-shadow: 0 0 15px 4px rgba(0,0,0,0.06);\n}\n\n.login-button,\n.book-button {\n  width: 8vw;\n}\n\n.login-button,\n.check-date-availability-button, \n.check-room-availability-button,\n.guest-portal-button,\n.book-button {\n  background-color: rgb(118, 118, 118);\n  color: white;\n  transition-duration: 0.4s;\n}\n\n.login-button:hover,\n.check-date-availability-button:hover, \n.check-room-availability-button:hover,\n.guest-portal-button:hover,\n.book-button:hover {\n  background-color: #505050;\n  color: white;\n}\n\n.guest-portal-container {\n  display: flex;\n  flex-direction: column;\n}\n\n.all-bookings-container {\n  position: relative;\n  display: flex;\n  justify-content: space-evenly;\n  margin-top: 15vh;\n  padding-bottom: 5vh;\n}\n\n\n.past-bookings-container, \n.future-bookings-container {\n  background-color: white;\n  height: 30vh;\n  width: 45vw;\n  overflow-y:auto;\n  box-shadow:0 0 15px 4px rgba(0,0,0,0.06);\n}\n\n.past-bookings-title, \n.past-bookings-body, \n.future-bookings-title, \n.future-bookings-body,\n.available-rooms-title,\n.available-rooms-body,\n.booked-message-title {\n  margin: 20px 40px 20px 40px;\n}\n\n.available-rooms-title,\n.login-error-message {\n  text-align: center;\n}\n\n.spending-container-styling,\n.available-rooms-styling {\n  display: flex;\n  justify-content: center;\n}\n\n.spending-container {\n  position: relative;\n  width: 45vw;\n  display: flex;\n  justify-content: space-evenly;\n  box-shadow:0 0 15px 4px rgba(0,0,0,0.06);\n  margin-bottom: 10vh;\n}\n\n.available-rooms-container {\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  background-color: white;\n  height: fit-content;\n  width: 55vw;\n  margin-top: 15vh;\n  margin-bottom: 10vh;\n  box-shadow:0 0 15px 4px rgba(0,0,0,0.06);\n}\n\n.apology-title,\n.booked-message-title {\n  margin-top: -.7vh;\n  text-align: -webkit-center;\n}\n\n.booked-message-title {\n  margin-top: 20px;\n}\n\np,\nli {\n  margin-top: -1px;\n  margin-bottom: -1px;\n}\n\n.room-type-and-cost {\n  font-size: 2.5vh;\n}\n\n.hidden {\n  display: none;\n}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),
/* 4 */
/***/ ((module) => {



function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr && (typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]); if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

module.exports = function cssWithMappingToString(item) {
  var _item = _slicedToArray(item, 4),
      content = _item[1],
      cssMapping = _item[3];

  if (typeof btoa === "function") {
    // eslint-disable-next-line no-undef
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    var sourceURLs = cssMapping.sources.map(function (source) {
      return "/*# sourceURL=".concat(cssMapping.sourceRoot || "").concat(source, " */");
    });
    return [content].concat(sourceURLs).concat([sourceMapping]).join("\n");
  }

  return [content].join("\n");
};

/***/ }),
/* 5 */
/***/ ((module) => {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
// eslint-disable-next-line func-names
module.exports = function (cssWithMappingToString) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = cssWithMappingToString(item);

      if (item[2]) {
        return "@media ".concat(item[2], " {").concat(content, "}");
      }

      return content;
    }).join("");
  }; // import a list of modules into the list
  // eslint-disable-next-line func-names


  list.i = function (modules, mediaQuery, dedupe) {
    if (typeof modules === "string") {
      // eslint-disable-next-line no-param-reassign
      modules = [[null, modules, ""]];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var i = 0; i < this.length; i++) {
        // eslint-disable-next-line prefer-destructuring
        var id = this[i][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _i = 0; _i < modules.length; _i++) {
      var item = [].concat(modules[_i]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        // eslint-disable-next-line no-continue
        continue;
      }

      if (mediaQuery) {
        if (!item[2]) {
          item[2] = mediaQuery;
        } else {
          item[2] = "".concat(mediaQuery, " and ").concat(item[2]);
        }
      }

      list.push(item);
    }
  };

  return list;
};

/***/ }),
/* 6 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class Customer {
  constructor(customer) {
    this.id = customer.id
    this.name = customer.name
    this.pastBookings = []
    this.futureBookings = []
    this.totalSpending = 0
  }
  getPastBookings = (allBookings) => {
    this.pastBookings = allBookings.filter(booking => {
      let today = new Date()
      let bookingDate = new Date(booking.date)
      if (booking.userID === this.id && today.getTime() > bookingDate.getTime()) {
        return booking
      }
    })
  }
  getFutureBookings = (allBookings) => {
    this.futureBookings = allBookings.filter(booking => {
      let today = new Date()
      let bookingDate = new Date(booking.date)
      if (booking.userID === this.id && today.getTime() < bookingDate.getTime()) {
        return booking
      }
    })
  }
  getTotalSpent = (allRooms) => {
    this.totalSpending = 0
    let bookedRooms = this.pastBookings.concat(this.futureBookings)
    let bookedRoomNumbers = bookedRooms.map(room => room.roomNumber)
    bookedRoomNumbers.forEach(bookedRoom => {
      allRooms.forEach(room => {
        if (bookedRoom === room.number) {
         this.totalSpending += room.costPerNight
        }
      })
    })
    return this.totalSpending
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Customer);

/***/ }),
/* 7 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class Room {
  constructor(room) {
    this.roomNumber = room.number
    this.roomType = room.roomType
    this.bidet = room.bidet
    this.bedSize = room.bedSize
    this.numBeds = room.numBeds
    this.costPerNight = room.costPerNight
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Room);

/***/ }),
/* 8 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class AllBookings {
  constructor(bookings) {
    this.bookings = bookings
  }
  getUnavailableRooms = (date) => {
    let roomsBookedOnSelectedDate = this.bookings.reduce((arr, booking) => {
      if ( (new Date(booking.date).toISOString()).split('T')[0] === date && (!arr.includes(booking))) {
        arr.push(booking.roomNumber)
      }
      return arr
    }, [])
    return roomsBookedOnSelectedDate
  }
  getAvailableRooms = (allRooms, unavailableRooms) => {
    let availableRooms = allRooms.filter(room => {
      if (!unavailableRooms.includes(room.number)) {
        return room
      }
    })
    return availableRooms
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (AllBookings);

/***/ }),
/* 9 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("images/bathhouse.png");

/***/ }),
/* 10 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("images/no-face.gif");

/***/ })
/******/ 	]);
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
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
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
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _css_styles_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _classes_Customer_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6);
/* harmony import */ var _classes_Room_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7);
/* harmony import */ var _classes_Booking_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(8);
/* harmony import */ var _images_bathhouse_png__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(9);
/* harmony import */ var _images_no_face_gif__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(10);







// GLOBAL VARIABLES

let customersData
let roomsData
let bookingsData
let currentUser
let today = ((new Date()).toISOString()).split('T')[0]

// QUERY SELECTORS

const loginView = document.querySelector('.login-container')
const usernameField = document.querySelector('#username')
const passwordField = document.querySelector('#password')
const loginButton = document.querySelector('.login-button')
const loginErrorMessage = document.querySelector('.login-error-message')
const homeView = document.querySelector('.greeting-container')
const guestPortalView = document.querySelector('.guest-portal-container')
const guestPortalButton = document.querySelector('.guest-portal-button')
const pastBookings = document.querySelector('.past-bookings-body') 
const futureBookings = document.querySelector('.future-bookings-body')
const totalSpending = document.querySelector('.spending-title')
const dateForm = document.querySelector('.date-form')
const roomForm = document.querySelector('.room-form')
const checkDateAvailabilityButton = document.querySelector('.check-date-availability-button')
const checkRoomAvailabilityButton = document.querySelector('.check-room-availability-button')
const apologyMessage = document.querySelector('.apology-title')
const bookedMessage = document.querySelector('.booked-message-title')
const availableRoomsView = document.querySelector('.available-rooms-container')
const availableRoomsTitle = document.querySelector('.available-rooms-title')
const availableRoomsDisplay = document.querySelector('.available-rooms-body')

// EVENT LISTENERS

window.addEventListener('load', () => instantiateData('load'))
loginButton.addEventListener('click', logIn)
guestPortalButton.addEventListener('click', displayGuestPortalView)
checkDateAvailabilityButton.addEventListener('click', getAvailableRooms)
checkRoomAvailabilityButton.addEventListener('click', filterByRoomTypes)

// API CALLS

const gatherData = (url) => {
  return fetch(url)
    .then(response => response.json())
    .catch(err => console.log(err))
}

function instantiateData(condition) {
  Promise.all([
    gatherData('http://localhost:3001/api/v1/customers'),
    gatherData('http://localhost:3001/api/v1/rooms'),
    gatherData('http://localhost:3001/api/v1/bookings')
  ]).then(data => {
      customersData = data[0].customers
      roomsData = data[1].rooms
      bookingsData = new _classes_Booking_js__WEBPACK_IMPORTED_MODULE_3__.default(data[2].bookings)
      if (condition === 'update') {
        populateDashboard(bookingsData)
      }
    })
    .catch(err => console.log(err))
}

function postData(newBooking) {
  fetch('http://localhost:3001/api/v1/bookings', {
    method: 'POST',
    body: JSON.stringify(newBooking),
    headers: {
      'Content-Type': 'application/json'
      }
  })
  .then(response => response.json())
  .then(() => instantiateData('update'))
  .then(() => displaySuccessfulBooking())
  .catch(err => console.log(err))
}

function logIn(event) {
  event.preventDefault()
  let guestUserNameInput = usernameField.value
  let guestPasswordInput = passwordField.value
  let firstEightChar = guestUserNameInput.slice(0, 8)
  let lastTwoChar = guestUserNameInput.slice(8)
  let filteredCustomer = customersData.filter(customer => customer.id === parseInt(lastTwoChar))
  if (firstEightChar === 'customer' && 
    !(/\s/.test(guestUserNameInput)) &&
    parseInt(lastTwoChar) < 51 &&
    parseInt(lastTwoChar) != 0 &&
    guestPasswordInput === 'overlook2021') {
      renderUser(filteredCustomer)
      displayHomeView()
    } else {
      unhide(loginErrorMessage)
    }
}

function renderUser(guest) {
  currentUser = new _classes_Customer_js__WEBPACK_IMPORTED_MODULE_1__.default(guest[0])
  populateDashboard(bookingsData)
  tidyUpDateForm()
}

function populateDashboard(bookingsData) {
  currentUser.getPastBookings(bookingsData.bookings)
  currentUser.getFutureBookings(bookingsData.bookings)
  let totalSpent = (Math.floor((currentUser.getTotalSpent(roomsData)) * 100) / 100).toFixed(2)

  pastBookings.innerHTML = ''
  currentUser.pastBookings.forEach(booking => {
    pastBookings.innerHTML += `<li class='listed-reservations'>Date of stay: ${booking.date} Room number: ${booking.roomNumber}</li><br>`
  })
  futureBookings.innerHTML = ''
  currentUser.futureBookings.forEach(booking => {
    futureBookings.innerHTML += `<li class='listed-reservations'>Date of stay: ${booking.date} Room number: ${booking.roomNumber}</li><br>`
  })
  totalSpending.innerHTML = `Total Spent: $${totalSpent}`
}

function getAvailableRooms() {
  let unavailableRooms = bookingsData.getUnavailableRooms(dateForm.value)
  let availableRooms = bookingsData.getAvailableRooms(roomsData, unavailableRooms)
  displayApologyMessage(availableRooms)
  return availableRooms
}

function filterByRoomTypes() {
  let availableRooms = getAvailableRooms()
  let filteredAvailableRooms = availableRooms.filter(room => {
    if (room.roomType === roomForm.value) {
      return room
    }
  })
  displayApologyMessage(filteredAvailableRooms)
}

function renderAvailableRooms(availableRooms) {
  availableRoomsDisplay.innerHTML = ''
  availableRooms.forEach(room => {
    let bidetTrue = ` and a luxurious bidet`
    let singleBed = ` ${room.numBeds} ${room.bedSize} bed`
    let manyBeds = ` ${room.numBeds} ${room.bedSize} beds`
    availableRoomsDisplay.innerHTML += `<button class="book-button" value="${room.number}">Book now!</button>`
    availableRoomsDisplay.innerHTML += `<p class="room-type-and-cost">
    ${room.roomType} for $${room.costPerNight} per night
    <br>
    `
    if (room.numBeds === 1 && room.bidet) {
      availableRoomsDisplay.innerHTML += `<p class="amenities">Amenities include: ${singleBed} ${bidetTrue}<br><br><br>`
    } else if (room.numBeds === 1 && !room.bidet) {
      availableRoomsDisplay.innerHTML += `<p class="amenities">Amenities include: ${singleBed}<br><br><br>`
    } else if (room.numBeds >= 2 && room.bidet) {
      availableRoomsDisplay.innerHTML += `<p class="amenities">Amenities include: ${manyBeds} ${bidetTrue}<br><br><br>`
    } else {
      availableRoomsDisplay.innerHTML += `<p class="amenities">Amenities include: ${manyBeds}<br><br><br>`
    }
  })
  const bookedButtons = document.querySelectorAll('.book-button')
  bookedButtons.forEach(button => {
    button.addEventListener('click', bookRoom)
  })
  displayAvailableRoomsView()
}

function bookRoom(event) {
  let bookedRoomNum = event.target.value
  let newBooking = { userID: currentUser.id, date: (dateForm.value).split('-').join('/'), roomNumber: parseInt(bookedRoomNum) }
  postData(newBooking)
}

function tidyUpDateForm() {
  dateForm.setAttribute('value', today), dateForm.setAttribute('min', today)
}

function displayApologyMessage(list) {
  if (list.length === 0) {
    apologyMessage.classList.remove('hidden')
    renderAvailableRooms(list)
  } else {
    apologyMessage.classList.add('hidden')
    renderAvailableRooms(list)
  }
}

function displayHomeView() {
  hide(loginView)
  unhide(homeView)
}

function displayGuestPortalView() {
  hide(availableRoomsView)
  hide(roomForm)
  unhide(guestPortalView)
}

function displayAvailableRoomsView() {
  hide(guestPortalView)
  hide(bookedMessage)
  unhide(availableRoomsView)
  unhide(availableRoomsDisplay)
  unhide(roomForm)
  unhide(checkRoomAvailabilityButton)
  unhide(availableRoomsTitle)
}

function displaySuccessfulBooking() {
  hide(availableRoomsDisplay)
  hide(roomForm)
  hide(checkRoomAvailabilityButton)
  hide(availableRoomsTitle)
  unhide(bookedMessage)
}

function hide(element) {
  element.classList.add('hidden')
}

function unhide(element) {
  element.classList.remove('hidden')
}
})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map