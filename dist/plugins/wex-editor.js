(function(global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ?  factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global.WexEditor = {})));
})(this, function(exports) {
Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
// \0rolldown/runtime.js
	var __defProp = Object.defineProperty;
	var __commonJSMin = (cb, mod) => () => (mod || (cb((mod = { exports: {} }).exports, mod, mod.exports), cb = null), mod.exports);
	var __exportAll = (all, flags) => {
		let target = Object.setPrototypeOf({}, null);
		for (var name in all) {
			__defProp(target, name, {
				get: all[name],
				enumerable: true
			});
		}
		if (!(flags & 1)) {
			__defProp(target, Symbol.toStringTag, { value: "Module" });
		}
		return flags & 2 ? target : Object.preventExtensions(target);
	};

// src/vendor/ScopeX.js
	var require_ScopeX = /* @__PURE__ */ __commonJSMin(((exports) => {
		(function(fn) {
			var ScopeX = fn();
			if (typeof exports !== "undefined") {
				exports.default = ScopeX;
				exports.ScopeX = ScopeX;
				exports.createScope = ScopeX.createScope;
				exports.__esModule = true;
			} else if (typeof window !== "undefined") window.ScopeX = ScopeX;
			else if (typeof self !== "undefined") self.ScopeX = ScopeX;
		})(function() {
			"use strict";
			var window = { document: {} };
			/**
			* @ngdoc module
			* @name ng
			* @module ng
			* @installation
			* @description
			*
			* # ng (core module)
			* The ng module is loaded by default when an AngularJS application is started. The module itself
			* contains the essential components for an AngularJS application to function. The table below
			* lists a high level breakdown of each of the services/factories, filters, directives and testing
			* components available within this core module.
			*
			* <div doc-module-components="ng"></div>
			*/
			var hasOwnProperty = Object.prototype.hasOwnProperty;
			var lowercase = function(string) {
				return isString(string) ? string.toLowerCase() : string;
			};
			/**
			* @ngdoc function
			* @name angular.isArray
			* @module ng
			* @kind function
			*
			* @description
			* Determines if a reference is an `Array`.
			*
			* @param {*} value Reference to check.
			* @returns {boolean} True if `value` is an `Array`.
			*/
			var isArray = Array.isArray;
			var manualLowercase = function(s) {
				return isString(s) ? s.replace(/[A-Z]/g, function(ch) {
					return String.fromCharCode(ch.charCodeAt(0) | 32);
				}) : s;
			};
			var manualUppercase = function(s) {
				return isString(s) ? s.replace(/[a-z]/g, function(ch) {
					return String.fromCharCode(ch.charCodeAt(0) & -33);
				}) : s;
			};
			if ("i" !== "I".toLowerCase()) {
				lowercase = manualLowercase;
				uppercase = manualUppercase;
			}
			var jqLite, toString = Object.prototype.toString, getPrototypeOf = Object.getPrototypeOf, ngMinErr = minErr("ng");
			window.angular || (window.angular = {});
			/**
			* @private
			* @param {*} obj
			* @return {boolean} Returns true if `obj` is an array or array-like object (NodeList, Arguments,
			*                   String ...)
			*/
			function isArrayLike(obj) {
				if (obj == null || isWindow(obj)) return false;
				if (isArray(obj) || isString(obj) || jqLite && obj instanceof jqLite) return true;
				var length = "length" in Object(obj) && obj.length;
				return isNumber(length) && (length >= 0 && (length - 1 in obj || obj instanceof Array) || typeof obj.item === "function");
			}
			/**
			* @ngdoc function
			* @name angular.forEach
			* @module ng
			* @kind function
			*
			* @description
			* Invokes the `iterator` function once for each item in `obj` collection, which can be either an
			* object or an array. The `iterator` function is invoked with `iterator(value, key, obj)`, where `value`
			* is the value of an object property or an array element, `key` is the object property key or
			* array element index and obj is the `obj` itself. Specifying a `context` for the function is optional.
			*
			* It is worth noting that `.forEach` does not iterate over inherited properties because it filters
			* using the `hasOwnProperty` method.
			*
			* Unlike ES262's
			* [Array.prototype.forEach](http://www.ecma-international.org/ecma-262/5.1/#sec-15.4.4.18),
			* providing 'undefined' or 'null' values for `obj` will not throw a TypeError, but rather just
			* return the value provided.
			*
			```js
			var values = {name: 'misko', gender: 'male'};
			var log = [];
			angular.forEach(values, function(value, key) {
			this.push(key + ': ' + value);
			}, log);
			expect(log).toEqual(['name: misko', 'gender: male']);
			```
			*
			* @param {Object|Array} obj Object to iterate over.
			* @param {Function} iterator Iterator function.
			* @param {Object=} context Object to become context (`this`) for the iterator function.
			* @returns {Object|Array} Reference to `obj`.
			*/
			function forEach(obj, iterator, context) {
				var key, length;
				if (obj) {
					if (isFunction(obj)) {
						for (key in obj) if (key !== "prototype" && key !== "length" && key !== "name" && obj.hasOwnProperty(key)) iterator.call(context, obj[key], key, obj);
					} else if (isArray(obj) || isArrayLike(obj)) {
						var isPrimitive = typeof obj !== "object";
						for (key = 0, length = obj.length; key < length; key++) if (isPrimitive || key in obj) iterator.call(context, obj[key], key, obj);
					} else if (obj.forEach && obj.forEach !== forEach) obj.forEach(iterator, context, obj);
					else if (isBlankObject(obj)) for (key in obj) iterator.call(context, obj[key], key, obj);
					else if (typeof obj.hasOwnProperty === "function") {
						for (key in obj) if (obj.hasOwnProperty(key)) iterator.call(context, obj[key], key, obj);
					} else for (key in obj) if (hasOwnProperty.call(obj, key)) iterator.call(context, obj[key], key, obj);
				}
				return obj;
			}
			/**
			* Set or clear the hashkey for an object.
			* @param obj object
			* @param h the hashkey (!truthy to delete the hashkey)
			*/
			function setHashKey(obj, h) {
				if (h) obj.$$hashKey = h;
				else delete obj.$$hashKey;
			}
			/**
			* @ngdoc function
			* @name angular.noop
			* @module ng
			* @kind function
			*
			* @description
			* A function that performs no operations. This function can be useful when writing code in the
			* functional style.
			```js
			function foo(callback) {
			var result = calculateResult();
			(callback || angular.noop)(result);
			}
			```
			*/
			function noop() {}
			noop.$inject = [];
			/**
			* @ngdoc function
			* @name angular.isUndefined
			* @module ng
			* @kind function
			*
			* @description
			* Determines if a reference is undefined.
			*
			* @param {*} value Reference to check.
			* @returns {boolean} True if `value` is undefined.
			*/
			function isUndefined(value) {
				return typeof value === "undefined";
			}
			/**
			* @ngdoc function
			* @name angular.isDefined
			* @module ng
			* @kind function
			*
			* @description
			* Determines if a reference is defined.
			*
			* @param {*} value Reference to check.
			* @returns {boolean} True if `value` is defined.
			*/
			function isDefined(value) {
				return typeof value !== "undefined";
			}
			/**
			* @ngdoc function
			* @name angular.isObject
			* @module ng
			* @kind function
			*
			* @description
			* Determines if a reference is an `Object`. Unlike `typeof` in JavaScript, `null`s are not
			* considered to be objects. Note that JavaScript arrays are objects.
			*
			* @param {*} value Reference to check.
			* @returns {boolean} True if `value` is an `Object` but not `null`.
			*/
			function isObject(value) {
				return value !== null && typeof value === "object";
			}
			/**
			* Determine if a value is an object with a null prototype
			*
			* @returns {boolean} True if `value` is an `Object` with a null prototype
			*/
			function isBlankObject(value) {
				return value !== null && typeof value === "object" && !getPrototypeOf(value);
			}
			/**
			* @ngdoc function
			* @name angular.isString
			* @module ng
			* @kind function
			*
			* @description
			* Determines if a reference is a `String`.
			*
			* @param {*} value Reference to check.
			* @returns {boolean} True if `value` is a `String`.
			*/
			function isString(value) {
				return typeof value === "string";
			}
			/**
			* @ngdoc function
			* @name angular.isNumber
			* @module ng
			* @kind function
			*
			* @description
			* Determines if a reference is a `Number`.
			*
			* This includes the "special" numbers `NaN`, `+Infinity` and `-Infinity`.
			*
			* If you wish to exclude these then you can use the native
			* [`isFinite'](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/isFinite)
			* method.
			*
			* @param {*} value Reference to check.
			* @returns {boolean} True if `value` is a `Number`.
			*/
			function isNumber(value) {
				return typeof value === "number";
			}
			/**
			* @ngdoc function
			* @name angular.isFunction
			* @module ng
			* @kind function
			*
			* @description
			* Determines if a reference is a `Function`.
			*
			* @param {*} value Reference to check.
			* @returns {boolean} True if `value` is a `Function`.
			*/
			function isFunction(value) {
				return typeof value === "function";
			}
			/**
			* Checks if `obj` is a window object.
			*
			* @private
			* @param {*} obj Object to check
			* @returns {boolean} True if `obj` is a window obj.
			*/
			function isWindow(obj) {
				return obj && obj.window === obj;
			}
			function isScope(obj) {
				return obj && obj.$evalAsync && obj.$watch;
			}
			var TYPED_ARRAY_REGEXP = /^\[object (?:Uint8|Uint8Clamped|Uint16|Uint32|Int8|Int16|Int32|Float32|Float64)Array\]$/;
			function isTypedArray(value) {
				return value && isNumber(value.length) && TYPED_ARRAY_REGEXP.test(toString.call(value));
			}
			function isArrayBuffer(obj) {
				return toString.call(obj) === "[object ArrayBuffer]";
			}
			/**
			* @ngdoc function
			* @name angular.copy
			* @module ng
			* @kind function
			*
			* @description
			* Creates a deep copy of `source`, which should be an object or an array.
			*
			* * If no destination is supplied, a copy of the object or array is created.
			* * If a destination is provided, all of its elements (for arrays) or properties (for objects)
			*   are deleted and then all elements/properties from the source are copied to it.
			* * If `source` is not an object or array (inc. `null` and `undefined`), `source` is returned.
			* * If `source` is identical to `destination` an exception will be thrown.
			*
			* <br />
			* <div class="alert alert-warning">
			*   Only enumerable properties are taken into account. Non-enumerable properties (both on `source`
			*   and on `destination`) will be ignored.
			* </div>
			*
			* @param {*} source The source that will be used to make a copy.
			*                   Can be any type, including primitives, `null`, and `undefined`.
			* @param {(Object|Array)=} destination Destination into which the source is copied. If
			*     provided, must be of the same type as `source`.
			* @returns {*} The copy or updated `destination`, if `destination` was specified.
			*
			* @example
			<example module="copyExample" name="angular-copy">
			<file name="index.html">
			<div ng-controller="ExampleController">
			<form novalidate class="simple-form">
			<label>Name: <input type="text" ng-model="user.name" /></label><br />
			<label>Age:  <input type="number" ng-model="user.age" /></label><br />
			Gender: <label><input type="radio" ng-model="user.gender" value="male" />male</label>
			<label><input type="radio" ng-model="user.gender" value="female" />female</label><br />
			<button ng-click="reset()">RESET</button>
			<button ng-click="update(user)">SAVE</button>
			</form>
			<pre>form = {{user | json}}</pre>
			<pre>master = {{master | json}}</pre>
			</div>
			</file>
			<file name="script.js">
			// Module: copyExample
			angular.
			module('copyExample', []).
			controller('ExampleController', ['$scope', function($scope) {
			$scope.master = {};
			
			$scope.reset = function() {
			// Example with 1 argument
			$scope.user = angular.copy($scope.master);
			};
			
			$scope.update = function(user) {
			// Example with 2 arguments
			angular.copy(user, $scope.master);
			};
			
			$scope.reset();
			}]);
			</file>
			</example>
			*/
			function copy(source, destination) {
				var stackSource = [];
				var stackDest = [];
				if (destination) {
					if (isTypedArray(destination) || isArrayBuffer(destination)) throw ngMinErr("cpta", "Can't copy! TypedArray destination cannot be mutated.");
					if (source === destination) throw ngMinErr("cpi", "Can't copy! Source and destination are identical.");
					if (isArray(destination)) destination.length = 0;
					else forEach(destination, function(value, key) {
						if (key !== "$$hashKey") delete destination[key];
					});
					stackSource.push(source);
					stackDest.push(destination);
					return copyRecurse(source, destination);
				}
				return copyElement(source);
				function copyRecurse(source, destination) {
					var h = destination.$$hashKey;
					var key;
					if (isArray(source)) for (var i = 0, ii = source.length; i < ii; i++) destination.push(copyElement(source[i]));
					else if (isBlankObject(source)) for (key in source) destination[key] = copyElement(source[key]);
					else if (source && typeof source.hasOwnProperty === "function") {
						for (key in source) if (source.hasOwnProperty(key)) destination[key] = copyElement(source[key]);
					} else for (key in source) if (hasOwnProperty.call(source, key)) destination[key] = copyElement(source[key]);
					setHashKey(destination, h);
					return destination;
				}
				function copyElement(source) {
					if (!isObject(source)) return source;
					var index = stackSource.indexOf(source);
					if (index !== -1) return stackDest[index];
					if (isWindow(source) || isScope(source)) throw ngMinErr("cpws", "Can't copy! Making copies of Window or Scope instances is not supported.");
					var needsRecurse = false;
					var destination = copyType(source);
					if (destination === void 0) {
						destination = isArray(source) ? [] : Object.create(getPrototypeOf(source));
						needsRecurse = true;
					}
					stackSource.push(source);
					stackDest.push(destination);
					return needsRecurse ? copyRecurse(source, destination) : destination;
				}
				function copyType(source) {
					switch (toString.call(source)) {
						case "[object Int8Array]":
						case "[object Int16Array]":
						case "[object Int32Array]":
						case "[object Float32Array]":
						case "[object Float64Array]":
						case "[object Uint8Array]":
						case "[object Uint8ClampedArray]":
						case "[object Uint16Array]":
						case "[object Uint32Array]": return new source.constructor(copyElement(source.buffer), source.byteOffset, source.length);
						case "[object ArrayBuffer]":
							if (!source.slice) {
								var copied = new ArrayBuffer(source.byteLength);
								new Uint8Array(copied).set(new Uint8Array(source));
								return copied;
							}
							return source.slice(0);
						case "[object Boolean]":
						case "[object Number]":
						case "[object String]":
						case "[object Date]": return new source.constructor(source.valueOf());
						case "[object RegExp]":
							var re = new RegExp(source.source, source.toString().match(/[^\/]*$/)[0]);
							re.lastIndex = source.lastIndex;
							return re;
						case "[object Blob]": return new source.constructor([source], { type: source.type });
					}
					if (isFunction(source.cloneNode)) return source.cloneNode(true);
				}
			}
			function toJsonReplacer(key, value) {
				var val = value;
				if (typeof key === "string" && key.charAt(0) === "$" && key.charAt(1) === "$") val = void 0;
				else if (isWindow(value)) val = "$WINDOW";
				else if (value && window.document === value) val = "$DOCUMENT";
				else if (isScope(value)) val = "$SCOPE";
				return val;
			}
			/**
			* Creates a new object without a prototype. This object is useful for lookup without having to
			* guard against prototypically inherited properties via hasOwnProperty.
			*
			* Related micro-benchmarks:
			* - http://jsperf.com/object-create2
			* - http://jsperf.com/proto-map-lookup/2
			* - http://jsperf.com/for-in-vs-object-keys2
			*
			* @returns {Object}
			*/
			function createMap() {
				return Object.create(null);
			}
			function serializeObject(obj) {
				var seen = [];
				return JSON.stringify(obj, function(key, val) {
					val = toJsonReplacer(key, val);
					if (isObject(val)) {
						if (seen.indexOf(val) >= 0) return "...";
						seen.push(val);
					}
					return val;
				});
			}
			function toDebugString(obj) {
				if (typeof obj === "function") return obj.toString().replace(/ \{[\s\S]*$/, "");
				else if (isUndefined(obj)) return "undefined";
				else if (typeof obj !== "string") return serializeObject(obj);
				return obj;
			}
			/**
			* @description
			*
			* This object provides a utility for producing rich Error messages within
			* Angular. It can be called as follows:
			*
			* var exampleMinErr = minErr('example');
			* throw exampleMinErr('one', 'This {0} is {1}', foo, bar);
			*
			* The above creates an instance of minErr in the example namespace. The
			* resulting error will have a namespaced error code of example.one.  The
			* resulting error will replace {0} with the value of foo, and {1} with the
			* value of bar. The object is not restricted in the number of arguments it can
			* take.
			*
			* If fewer arguments are specified than necessary for interpolation, the extra
			* interpolation markers will be preserved in the final string.
			*
			* Since data will be parsed statically during a build step, some restrictions
			* are applied with respect to how minErr instances are created and called.
			* Instances should have names of the form namespaceMinErr for a minErr created
			* using minErr('namespace') . Error codes, namespaces and template strings
			* should all be static strings, not variables or general expressions.
			*
			* @param {string} module The namespace to use for the new minErr instance.
			* @param {function} ErrorConstructor Custom error constructor to be instantiated when returning
			*   error from returned function, for cases when a particular type of error is useful.
			* @returns {function(code:string, template:string, ...templateArgs): Error} minErr instance
			*/
			function minErr(module, ErrorConstructor) {
				ErrorConstructor = ErrorConstructor || Error;
				return function() {
					var SKIP_INDEXES = 2;
					var templateArgs = arguments, code = templateArgs[0], message = "[" + (module ? module + ":" : "") + code + "] ", template = templateArgs[1], paramPrefix, i;
					message += template.replace(/\{\d+\}/g, function(match) {
						var shiftedIndex = +match.slice(1, -1) + SKIP_INDEXES;
						if (shiftedIndex < templateArgs.length) return toDebugString(templateArgs[shiftedIndex]);
						return match;
					});
					message += "\nhttp://errors.angularjs.org/1.6.9/" + (module ? module + "/" : "") + code;
					for (i = SKIP_INDEXES, paramPrefix = "?"; i < templateArgs.length; i++, paramPrefix = "&") message += paramPrefix + "p" + (i - SKIP_INDEXES) + "=" + encodeURIComponent(toDebugString(templateArgs[i]));
					return new ErrorConstructor(message);
				};
			}
			var $parseMinErr = minErr("$parse");
			function getStringValue(name) {
				return name + "";
			}
			var OPERATORS = createMap();
			forEach("+ - * / % === !== == != < > <= >= && || ! = |".split(" "), function(operator) {
				OPERATORS[operator] = true;
			});
			var ESCAPE = {
				n: "\n",
				f: "\f",
				r: "\r",
				t: "	",
				v: "\v",
				"'": "'",
				"\"": "\""
			};
			/**
			* @constructor
			*/
			function Lexer(options) {
				this.options = options;
			}
			Lexer.prototype = {
				constructor: Lexer,
				lex: function(text) {
					this.text = text;
					this.index = 0;
					this.tokens = [];
					while (this.index < this.text.length) {
						var ch = this.text.charAt(this.index);
						if (ch === "\"" || ch === "'") this.readString(ch);
						else if (this.isNumber(ch) || ch === "." && this.isNumber(this.peek())) this.readNumber();
						else if (this.isIdentifierStart(this.peekMultichar())) this.readIdent();
						else if (this.is(ch, "(){}[].,;:?")) {
							this.tokens.push({
								index: this.index,
								text: ch
							});
							this.index++;
						} else if (this.isWhitespace(ch)) this.index++;
						else {
							var ch2 = ch + this.peek();
							var ch3 = ch2 + this.peek(2);
							var op1 = OPERATORS[ch];
							var op2 = OPERATORS[ch2];
							var op3 = OPERATORS[ch3];
							if (op1 || op2 || op3) {
								var token = op3 ? ch3 : op2 ? ch2 : ch;
								this.tokens.push({
									index: this.index,
									text: token,
									operator: true
								});
								this.index += token.length;
							} else this.throwError("Unexpected next character ", this.index, this.index + 1);
						}
					}
					return this.tokens;
				},
				is: function(ch, chars) {
					return chars.indexOf(ch) !== -1;
				},
				peek: function(i) {
					var num = i || 1;
					return this.index + num < this.text.length ? this.text.charAt(this.index + num) : false;
				},
				isNumber: function(ch) {
					return "0" <= ch && ch <= "9" && typeof ch === "string";
				},
				isWhitespace: function(ch) {
					return ch === " " || ch === "\r" || ch === "	" || ch === "\n" || ch === "\v" || ch === "\xA0";
				},
				isIdentifierStart: function(ch) {
					return this.options.isIdentifierStart ? this.options.isIdentifierStart(ch, this.codePointAt(ch)) : this.isValidIdentifierStart(ch);
				},
				isValidIdentifierStart: function(ch) {
					return "a" <= ch && ch <= "z" || "A" <= ch && ch <= "Z" || "_" === ch || ch === "$";
				},
				isIdentifierContinue: function(ch) {
					return this.options.isIdentifierContinue ? this.options.isIdentifierContinue(ch, this.codePointAt(ch)) : this.isValidIdentifierContinue(ch);
				},
				isValidIdentifierContinue: function(ch, cp) {
					return this.isValidIdentifierStart(ch, cp) || this.isNumber(ch);
				},
				codePointAt: function(ch) {
					if (ch.length === 1) return ch.charCodeAt(0);
					return (ch.charCodeAt(0) << 10) + ch.charCodeAt(1) - 56613888;
				},
				peekMultichar: function() {
					var ch = this.text.charAt(this.index);
					var peek = this.peek();
					if (!peek) return ch;
					var cp1 = ch.charCodeAt(0);
					var cp2 = peek.charCodeAt(0);
					if (cp1 >= 55296 && cp1 <= 56319 && cp2 >= 56320 && cp2 <= 57343) return ch + peek;
					return ch;
				},
				isExpOperator: function(ch) {
					return ch === "-" || ch === "+" || this.isNumber(ch);
				},
				throwError: function(error, start, end) {
					end = end || this.index;
					throw $parseMinErr("lexerr", "Lexer Error: {0} at column{1} in expression [{2}].", error, isDefined(start) ? "s " + start + "-" + this.index + " [" + this.text.substring(start, end) + "]" : " " + end, this.text);
				},
				readNumber: function() {
					var number = "";
					var start = this.index;
					while (this.index < this.text.length) {
						var ch = lowercase(this.text.charAt(this.index));
						if (ch === "." || this.isNumber(ch)) number += ch;
						else {
							var peekCh = this.peek();
							if (ch === "e" && this.isExpOperator(peekCh)) number += ch;
							else if (this.isExpOperator(ch) && peekCh && this.isNumber(peekCh) && number.charAt(number.length - 1) === "e") number += ch;
							else if (this.isExpOperator(ch) && (!peekCh || !this.isNumber(peekCh)) && number.charAt(number.length - 1) === "e") this.throwError("Invalid exponent");
							else break;
						}
						this.index++;
					}
					this.tokens.push({
						index: start,
						text: number,
						constant: true,
						value: Number(number)
					});
				},
				readIdent: function() {
					var start = this.index;
					this.index += this.peekMultichar().length;
					while (this.index < this.text.length) {
						var ch = this.peekMultichar();
						if (!this.isIdentifierContinue(ch)) break;
						this.index += ch.length;
					}
					this.tokens.push({
						index: start,
						text: this.text.slice(start, this.index),
						identifier: true
					});
				},
				readString: function(quote) {
					var start = this.index;
					this.index++;
					var string = "";
					var rawString = quote;
					var escape = false;
					while (this.index < this.text.length) {
						var ch = this.text.charAt(this.index);
						rawString += ch;
						if (escape) {
							if (ch === "u") {
								var hex = this.text.substring(this.index + 1, this.index + 5);
								if (!hex.match(/[\da-f]{4}/i)) this.throwError("Invalid unicode escape [\\u" + hex + "]");
								this.index += 4;
								string += String.fromCharCode(parseInt(hex, 16));
							} else {
								var rep = ESCAPE[ch];
								string = string + (rep || ch);
							}
							escape = false;
						} else if (ch === "\\") escape = true;
						else if (ch === quote) {
							this.index++;
							this.tokens.push({
								index: start,
								text: rawString,
								constant: true,
								value: string
							});
							return;
						} else string += ch;
						this.index++;
					}
					this.throwError("Unterminated quote", start);
				}
			};
			function AST(lexer, options) {
				this.lexer = lexer;
				this.options = options;
			}
			AST.Program = "Program";
			AST.ExpressionStatement = "ExpressionStatement";
			AST.AssignmentExpression = "AssignmentExpression";
			AST.ConditionalExpression = "ConditionalExpression";
			AST.LogicalExpression = "LogicalExpression";
			AST.BinaryExpression = "BinaryExpression";
			AST.UnaryExpression = "UnaryExpression";
			AST.CallExpression = "CallExpression";
			AST.MemberExpression = "MemberExpression";
			AST.Identifier = "Identifier";
			AST.Literal = "Literal";
			AST.ArrayExpression = "ArrayExpression";
			AST.Property = "Property";
			AST.ObjectExpression = "ObjectExpression";
			AST.ThisExpression = "ThisExpression";
			AST.LocalsExpression = "LocalsExpression";
			AST.NGValueParameter = "NGValueParameter";
			AST.prototype = {
				ast: function(text) {
					this.text = text;
					this.tokens = this.lexer.lex(text);
					var value = this.program();
					if (this.tokens.length !== 0) this.throwError("is an unexpected token", this.tokens[0]);
					return value;
				},
				program: function() {
					var body = [];
					while (true) {
						if (this.tokens.length > 0 && !this.peek("}", ")", ";", "]")) body.push(this.expressionStatement());
						if (!this.expect(";")) return {
							type: AST.Program,
							body
						};
					}
				},
				expressionStatement: function() {
					return {
						type: AST.ExpressionStatement,
						expression: this.filterChain()
					};
				},
				filterChain: function() {
					var left = this.expression();
					while (this.expect("|")) left = this.filter(left);
					return left;
				},
				expression: function() {
					return this.assignment();
				},
				assignment: function() {
					var result = this.ternary();
					if (this.expect("=")) {
						if (!isAssignable(result)) throw $parseMinErr("lval", "Trying to assign a value to a non l-value");
						result = {
							type: AST.AssignmentExpression,
							left: result,
							right: this.assignment(),
							operator: "="
						};
					}
					return result;
				},
				ternary: function() {
					var test = this.logicalOR();
					var alternate;
					var consequent;
					if (this.expect("?")) {
						alternate = this.expression();
						if (this.consume(":")) {
							consequent = this.expression();
							return {
								type: AST.ConditionalExpression,
								test,
								alternate,
								consequent
							};
						}
					}
					return test;
				},
				logicalOR: function() {
					var left = this.logicalAND();
					while (this.expect("||")) left = {
						type: AST.LogicalExpression,
						operator: "||",
						left,
						right: this.logicalAND()
					};
					return left;
				},
				logicalAND: function() {
					var left = this.equality();
					while (this.expect("&&")) left = {
						type: AST.LogicalExpression,
						operator: "&&",
						left,
						right: this.equality()
					};
					return left;
				},
				equality: function() {
					var left = this.relational();
					var token;
					while (token = this.expect("==", "!=", "===", "!==")) left = {
						type: AST.BinaryExpression,
						operator: token.text,
						left,
						right: this.relational()
					};
					return left;
				},
				relational: function() {
					var left = this.additive();
					var token;
					while (token = this.expect("<", ">", "<=", ">=")) left = {
						type: AST.BinaryExpression,
						operator: token.text,
						left,
						right: this.additive()
					};
					return left;
				},
				additive: function() {
					var left = this.multiplicative();
					var token;
					while (token = this.expect("+", "-")) left = {
						type: AST.BinaryExpression,
						operator: token.text,
						left,
						right: this.multiplicative()
					};
					return left;
				},
				multiplicative: function() {
					var left = this.unary();
					var token;
					while (token = this.expect("*", "/", "%")) left = {
						type: AST.BinaryExpression,
						operator: token.text,
						left,
						right: this.unary()
					};
					return left;
				},
				unary: function() {
					var token;
					if (token = this.expect("+", "-", "!")) return {
						type: AST.UnaryExpression,
						operator: token.text,
						prefix: true,
						argument: this.unary()
					};
					else return this.primary();
				},
				primary: function() {
					var primary;
					if (this.expect("(")) {
						primary = this.filterChain();
						this.consume(")");
					} else if (this.expect("[")) primary = this.arrayDeclaration();
					else if (this.expect("{")) primary = this.object();
					else if (this.selfReferential.hasOwnProperty(this.peek().text)) primary = copy(this.selfReferential[this.consume().text]);
					else if (this.options.literals.hasOwnProperty(this.peek().text)) primary = {
						type: AST.Literal,
						value: this.options.literals[this.consume().text]
					};
					else if (this.peek().identifier) primary = this.identifier();
					else if (this.peek().constant) primary = this.constant();
					else this.throwError("not a primary expression", this.peek());
					var next;
					while (next = this.expect("(", "[", ".")) if (next.text === "(") {
						primary = {
							type: AST.CallExpression,
							callee: primary,
							arguments: this.parseArguments()
						};
						this.consume(")");
					} else if (next.text === "[") {
						primary = {
							type: AST.MemberExpression,
							object: primary,
							property: this.expression(),
							computed: true
						};
						this.consume("]");
					} else if (next.text === ".") primary = {
						type: AST.MemberExpression,
						object: primary,
						property: this.identifier(),
						computed: false
					};
					else this.throwError("IMPOSSIBLE");
					return primary;
				},
				filter: function(baseExpression) {
					var args = [baseExpression];
					var result = {
						type: AST.CallExpression,
						callee: this.identifier(),
						arguments: args,
						filter: true
					};
					while (this.expect(":")) args.push(this.expression());
					return result;
				},
				parseArguments: function() {
					var args = [];
					if (this.peekToken().text !== ")") do
						args.push(this.filterChain());
					while (this.expect(","));
					return args;
				},
				identifier: function() {
					var token = this.consume();
					if (!token.identifier) this.throwError("is not a valid identifier", token);
					return {
						type: AST.Identifier,
						name: token.text
					};
				},
				constant: function() {
					return {
						type: AST.Literal,
						value: this.consume().value
					};
				},
				arrayDeclaration: function() {
					var elements = [];
					if (this.peekToken().text !== "]") do {
						if (this.peek("]")) break;
						elements.push(this.expression());
					} while (this.expect(","));
					this.consume("]");
					return {
						type: AST.ArrayExpression,
						elements
					};
				},
				object: function() {
					var properties = [], property;
					if (this.peekToken().text !== "}") do {
						if (this.peek("}")) break;
						property = {
							type: AST.Property,
							kind: "init"
						};
						if (this.peek().constant) {
							property.key = this.constant();
							property.computed = false;
							this.consume(":");
							property.value = this.expression();
						} else if (this.peek().identifier) {
							property.key = this.identifier();
							property.computed = false;
							if (this.peek(":")) {
								this.consume(":");
								property.value = this.expression();
							} else property.value = property.key;
						} else if (this.peek("[")) {
							this.consume("[");
							property.key = this.expression();
							this.consume("]");
							property.computed = true;
							this.consume(":");
							property.value = this.expression();
						} else this.throwError("invalid key", this.peek());
						properties.push(property);
					} while (this.expect(","));
					this.consume("}");
					return {
						type: AST.ObjectExpression,
						properties
					};
				},
				throwError: function(msg, token) {
					throw $parseMinErr("syntax", "Syntax Error: Token '{0}' {1} at column {2} of the expression [{3}] starting at [{4}].", token.text, msg, token.index + 1, this.text, this.text.substring(token.index));
				},
				consume: function(e1) {
					if (this.tokens.length === 0) throw $parseMinErr("ueoe", "Unexpected end of expression: {0}", this.text);
					var token = this.expect(e1);
					if (!token) this.throwError("is unexpected, expecting [" + e1 + "]", this.peek());
					return token;
				},
				peekToken: function() {
					if (this.tokens.length === 0) throw $parseMinErr("ueoe", "Unexpected end of expression: {0}", this.text);
					return this.tokens[0];
				},
				peek: function(e1, e2, e3, e4) {
					return this.peekAhead(0, e1, e2, e3, e4);
				},
				peekAhead: function(i, e1, e2, e3, e4) {
					if (this.tokens.length > i) {
						var token = this.tokens[i];
						var t = token.text;
						if (t === e1 || t === e2 || t === e3 || t === e4 || !e1 && !e2 && !e3 && !e4) return token;
					}
					return false;
				},
				expect: function(e1, e2, e3, e4) {
					var token = this.peek(e1, e2, e3, e4);
					if (token) {
						this.tokens.shift();
						return token;
					}
					return false;
				},
				selfReferential: {
					this: { type: AST.ThisExpression },
					$locals: { type: AST.LocalsExpression }
				}
			};
			function ifDefined(v, d) {
				return typeof v !== "undefined" ? v : d;
			}
			function plusFn(l, r) {
				if (typeof l === "undefined") return r;
				if (typeof r === "undefined") return l;
				return l + r;
			}
			function isStateless($filter, filterName) {
				return !$filter(filterName).$stateful;
			}
			function findConstantAndWatchExpressions(ast, $filter) {
				var allConstants;
				var argsToWatch;
				var isStatelessFilter;
				switch (ast.type) {
					case AST.Program:
						allConstants = true;
						forEach(ast.body, function(expr) {
							findConstantAndWatchExpressions(expr.expression, $filter);
							allConstants = allConstants && expr.expression.constant;
						});
						ast.constant = allConstants;
						break;
					case AST.Literal:
						ast.constant = true;
						ast.toWatch = [];
						break;
					case AST.UnaryExpression:
						findConstantAndWatchExpressions(ast.argument, $filter);
						ast.constant = ast.argument.constant;
						ast.toWatch = ast.argument.toWatch;
						break;
					case AST.BinaryExpression:
						findConstantAndWatchExpressions(ast.left, $filter);
						findConstantAndWatchExpressions(ast.right, $filter);
						ast.constant = ast.left.constant && ast.right.constant;
						ast.toWatch = ast.left.toWatch.concat(ast.right.toWatch);
						break;
					case AST.LogicalExpression:
						findConstantAndWatchExpressions(ast.left, $filter);
						findConstantAndWatchExpressions(ast.right, $filter);
						ast.constant = ast.left.constant && ast.right.constant;
						ast.toWatch = ast.constant ? [] : [ast];
						break;
					case AST.ConditionalExpression:
						findConstantAndWatchExpressions(ast.test, $filter);
						findConstantAndWatchExpressions(ast.alternate, $filter);
						findConstantAndWatchExpressions(ast.consequent, $filter);
						ast.constant = ast.test.constant && ast.alternate.constant && ast.consequent.constant;
						ast.toWatch = ast.constant ? [] : [ast];
						break;
					case AST.Identifier:
						ast.constant = false;
						ast.toWatch = [ast];
						break;
					case AST.MemberExpression:
						findConstantAndWatchExpressions(ast.object, $filter);
						if (ast.computed) findConstantAndWatchExpressions(ast.property, $filter);
						ast.constant = ast.object.constant && (!ast.computed || ast.property.constant);
						ast.toWatch = [ast];
						break;
					case AST.CallExpression:
						isStatelessFilter = ast.filter ? isStateless($filter, ast.callee.name) : false;
						allConstants = isStatelessFilter;
						argsToWatch = [];
						forEach(ast.arguments, function(expr) {
							findConstantAndWatchExpressions(expr, $filter);
							allConstants = allConstants && expr.constant;
							if (!expr.constant) argsToWatch.push.apply(argsToWatch, expr.toWatch);
						});
						ast.constant = allConstants;
						ast.toWatch = isStatelessFilter ? argsToWatch : [ast];
						break;
					case AST.AssignmentExpression:
						findConstantAndWatchExpressions(ast.left, $filter);
						findConstantAndWatchExpressions(ast.right, $filter);
						ast.constant = ast.left.constant && ast.right.constant;
						ast.toWatch = [ast];
						break;
					case AST.ArrayExpression:
						allConstants = true;
						argsToWatch = [];
						forEach(ast.elements, function(expr) {
							findConstantAndWatchExpressions(expr, $filter);
							allConstants = allConstants && expr.constant;
							if (!expr.constant) argsToWatch.push.apply(argsToWatch, expr.toWatch);
						});
						ast.constant = allConstants;
						ast.toWatch = argsToWatch;
						break;
					case AST.ObjectExpression:
						allConstants = true;
						argsToWatch = [];
						forEach(ast.properties, function(property) {
							findConstantAndWatchExpressions(property.value, $filter);
							allConstants = allConstants && property.value.constant && !property.computed;
							if (!property.value.constant) argsToWatch.push.apply(argsToWatch, property.value.toWatch);
						});
						ast.constant = allConstants;
						ast.toWatch = argsToWatch;
						break;
					case AST.ThisExpression:
						ast.constant = false;
						ast.toWatch = [];
						break;
					case AST.LocalsExpression:
						ast.constant = false;
						ast.toWatch = [];
				}
			}
			function getInputs(body) {
				if (body.length !== 1) return;
				var lastExpression = body[0].expression;
				var candidate = lastExpression.toWatch;
				if (candidate.length !== 1) return candidate;
				return candidate[0] !== lastExpression ? candidate : void 0;
			}
			function isAssignable(ast) {
				return ast.type === AST.Identifier || ast.type === AST.MemberExpression;
			}
			function assignableAST(ast) {
				if (ast.body.length === 1 && isAssignable(ast.body[0].expression)) return {
					type: AST.AssignmentExpression,
					left: ast.body[0].expression,
					right: { type: AST.NGValueParameter },
					operator: "="
				};
			}
			function isLiteral(ast) {
				return ast.body.length === 0 || ast.body.length === 1 && (ast.body[0].expression.type === AST.Literal || ast.body[0].expression.type === AST.ArrayExpression || ast.body[0].expression.type === AST.ObjectExpression);
			}
			function isConstant(ast) {
				return ast.constant;
			}
			function ASTCompiler(astBuilder, $filter) {
				this.astBuilder = astBuilder;
				this.$filter = $filter;
			}
			ASTCompiler.prototype = {
				compile: function(expression) {
					var self = this;
					var ast = this.astBuilder.ast(expression);
					this.state = {
						nextId: 0,
						filters: {},
						fn: {
							vars: [],
							body: [],
							own: {}
						},
						assign: {
							vars: [],
							body: [],
							own: {}
						},
						inputs: []
					};
					findConstantAndWatchExpressions(ast, self.$filter);
					var extra = "";
					var assignable;
					this.stage = "assign";
					if (assignable = assignableAST(ast)) {
						this.state.computing = "assign";
						var result = this.nextId();
						this.recurse(assignable, result);
						this.return_(result);
						extra = "fn.assign=" + this.generateFunction("assign", "s,v,l");
					}
					var toWatch = getInputs(ast.body);
					self.stage = "inputs";
					forEach(toWatch, function(watch, key) {
						var fnKey = "fn" + key;
						self.state[fnKey] = {
							vars: [],
							body: [],
							own: {}
						};
						self.state.computing = fnKey;
						var intoId = self.nextId();
						self.recurse(watch, intoId);
						self.return_(intoId);
						self.state.inputs.push(fnKey);
						watch.watchId = key;
					});
					this.state.computing = "fn";
					this.stage = "main";
					this.recurse(ast);
					var fnString = "\"" + this.USE + " " + this.STRICT + "\";\n" + this.filterPrefix() + "var fn=" + this.generateFunction("fn", "s,l,a,i") + extra + this.watchFns() + "return fn;";
					var fn = new Function("$filter", "getStringValue", "ifDefined", "plus", fnString)(this.$filter, getStringValue, ifDefined, plusFn);
					this.state = this.stage = void 0;
					fn.ast = ast;
					fn.literal = isLiteral(ast);
					fn.constant = isConstant(ast);
					return fn;
				},
				USE: "use",
				STRICT: "strict",
				watchFns: function() {
					var result = [];
					var fns = this.state.inputs;
					var self = this;
					forEach(fns, function(name) {
						result.push("var " + name + "=" + self.generateFunction(name, "s"));
					});
					if (fns.length) result.push("fn.inputs=[" + fns.join(",") + "];");
					return result.join("");
				},
				generateFunction: function(name, params) {
					return "function(" + params + "){" + this.varsPrefix(name) + this.body(name) + "};";
				},
				filterPrefix: function() {
					var parts = [];
					var self = this;
					forEach(this.state.filters, function(id, filter) {
						parts.push(id + "=$filter(" + self.escape(filter) + ")");
					});
					if (parts.length) return "var " + parts.join(",") + ";";
					return "";
				},
				varsPrefix: function(section) {
					return this.state[section].vars.length ? "var " + this.state[section].vars.join(",") + ";" : "";
				},
				body: function(section) {
					return this.state[section].body.join("");
				},
				recurse: function(ast, intoId, nameId, recursionFn, create, skipWatchIdCheck) {
					var left, right, self = this, args, expression, computed;
					recursionFn = recursionFn || noop;
					if (!skipWatchIdCheck && isDefined(ast.watchId)) {
						intoId = intoId || this.nextId();
						this.if_("i", this.lazyAssign(intoId, this.unsafeComputedMember("i", ast.watchId)), this.lazyRecurse(ast, intoId, nameId, recursionFn, create, true));
						return;
					}
					switch (ast.type) {
						case AST.Program:
							forEach(ast.body, function(expression, pos) {
								self.recurse(expression.expression, void 0, void 0, function(expr) {
									right = expr;
								});
								if (pos !== ast.body.length - 1) self.current().body.push(right, ";");
								else self.return_(right);
							});
							break;
						case AST.Literal:
							expression = this.escape(ast.value);
							this.assign(intoId, expression);
							recursionFn(intoId || expression);
							break;
						case AST.UnaryExpression:
							this.recurse(ast.argument, void 0, void 0, function(expr) {
								right = expr;
							});
							expression = ast.operator + "(" + this.ifDefined(right, 0) + ")";
							this.assign(intoId, expression);
							recursionFn(expression);
							break;
						case AST.BinaryExpression:
							this.recurse(ast.left, void 0, void 0, function(expr) {
								left = expr;
							});
							this.recurse(ast.right, void 0, void 0, function(expr) {
								right = expr;
							});
							if (ast.operator === "+") expression = this.plus(left, right);
							else if (ast.operator === "-") expression = this.ifDefined(left, 0) + ast.operator + this.ifDefined(right, 0);
							else expression = "(" + left + ")" + ast.operator + "(" + right + ")";
							this.assign(intoId, expression);
							recursionFn(expression);
							break;
						case AST.LogicalExpression:
							intoId = intoId || this.nextId();
							self.recurse(ast.left, intoId);
							self.if_(ast.operator === "&&" ? intoId : self.not(intoId), self.lazyRecurse(ast.right, intoId));
							recursionFn(intoId);
							break;
						case AST.ConditionalExpression:
							intoId = intoId || this.nextId();
							self.recurse(ast.test, intoId);
							self.if_(intoId, self.lazyRecurse(ast.alternate, intoId), self.lazyRecurse(ast.consequent, intoId));
							recursionFn(intoId);
							break;
						case AST.Identifier:
							intoId = intoId || this.nextId();
							if (nameId) {
								nameId.context = self.stage === "inputs" ? "s" : this.assign(this.nextId(), this.getHasOwnProperty("l", ast.name) + "?l:s");
								nameId.computed = false;
								nameId.name = ast.name;
							}
							self.if_(self.stage === "inputs" || self.not(self.getHasOwnProperty("l", ast.name)), function() {
								self.if_(self.stage === "inputs" || self.and_("s", self.or_(self.isNull(self.nonComputedMember("s", ast.name)), self.has_("s", ast.name))), function() {
									if (create && create !== 1) self.if_(self.isNull(self.nonComputedMember("s", ast.name)), self.lazyAssign(self.nonComputedMember("s", ast.name), "{}"));
									self.assign(intoId, self.nonComputedMember("s", ast.name));
								});
							}, intoId && self.lazyAssign(intoId, self.nonComputedMember("l", ast.name)));
							recursionFn(intoId);
							break;
						case AST.MemberExpression:
							left = nameId && (nameId.context = this.nextId()) || this.nextId();
							intoId = intoId || this.nextId();
							self.recurse(ast.object, left, void 0, function() {
								var member = null;
								var inAssignment = self.current().inAssignment;
								if (ast.computed) {
									right = self.nextId();
									if (inAssignment || self.state.computing === "assign") member = self.unsafeComputedMember(left, right);
									else member = self.computedMember(left, right);
								} else {
									if (inAssignment || self.state.computing === "assign") member = self.unsafeNonComputedMember(left, ast.property.name);
									else member = self.nonComputedMember(left, ast.property.name);
									right = ast.property.name;
								}
								if (ast.computed) {
									if (ast.property.type === AST.Literal) self.recurse(ast.property, right);
								}
								self.if_(self.and_(self.notNull(left), self.or_(self.isNull(member), self.has_(left, right, ast.computed))), function() {
									if (ast.computed) {
										if (ast.property.type !== AST.Literal) self.recurse(ast.property, right);
										if (create && create !== 1) self.if_(self.not(member), self.lazyAssign(member, "{}"));
										self.assign(intoId, member);
										if (nameId) {
											nameId.computed = true;
											nameId.name = right;
										}
									} else {
										if (create && create !== 1) self.if_(self.isNull(member), self.lazyAssign(member, "{}"));
										self.assign(intoId, member);
										if (nameId) {
											nameId.computed = false;
											nameId.name = ast.property.name;
										}
									}
								}, function() {
									self.assign(intoId, "undefined");
								});
								recursionFn(intoId);
							}, !!create);
							break;
						case AST.CallExpression:
							intoId = intoId || this.nextId();
							if (ast.filter) {
								right = self.filter(ast.callee.name);
								args = [];
								forEach(ast.arguments, function(expr) {
									var argument = self.nextId();
									self.recurse(expr, argument);
									args.push(argument);
								});
								expression = right + ".call(" + right + "," + args.join(",") + ")";
								self.assign(intoId, expression);
								recursionFn(intoId);
							} else {
								right = self.nextId();
								left = {};
								args = [];
								self.recurse(ast.callee, right, left, function() {
									self.if_(self.notNull(right), function() {
										forEach(ast.arguments, function(expr) {
											self.recurse(expr, ast.constant ? void 0 : self.nextId(), void 0, function(argument) {
												args.push(argument);
											});
										});
										if (left.name) expression = "(" + self.member(left.context, left.name, left.computed) + " === null ? null : " + self.unsafeMember(left.context, left.name, left.computed) + ".call(" + [left.context].concat(args).join(",") + "))";
										else expression = right + "(" + args.join(",") + ")";
										self.assign(intoId, expression);
									}, function() {
										self.assign(intoId, "undefined");
									});
									recursionFn(intoId);
								});
							}
							break;
						case AST.AssignmentExpression:
							right = this.nextId();
							left = {};
							self.current().inAssignment = true;
							this.recurse(ast.left, void 0, left, function() {
								self.if_(self.and_(self.notNull(left.context), self.or_(self.has_(left.context, left.name), self.isNull(self.member(left.context, left.name, left.computed)))), function() {
									self.recurse(ast.right, right);
									expression = self.member(left.context, left.name, left.computed) + ast.operator + right;
									self.assign(intoId, expression);
									recursionFn(intoId || expression);
								});
								self.current().inAssignment = false;
								self.recurse(ast.right, right);
								self.current().inAssignment = true;
							}, 1);
							self.current().inAssignment = false;
							break;
						case AST.ArrayExpression:
							args = [];
							forEach(ast.elements, function(expr) {
								self.recurse(expr, ast.constant ? void 0 : self.nextId(), void 0, function(argument) {
									args.push(argument);
								});
							});
							expression = "[" + args.join(",") + "]";
							this.assign(intoId, expression);
							recursionFn(intoId || expression);
							break;
						case AST.ObjectExpression:
							args = [];
							computed = false;
							forEach(ast.properties, function(property) {
								if (property.computed) computed = true;
							});
							if (computed) {
								intoId = intoId || this.nextId();
								this.assign(intoId, "{}");
								forEach(ast.properties, function(property) {
									if (property.computed) {
										left = self.nextId();
										self.recurse(property.key, left);
									} else left = property.key.type === AST.Identifier ? property.key.name : "" + property.key.value;
									right = self.nextId();
									self.recurse(property.value, right);
									self.assign(self.unsafeMember(intoId, left, property.computed), right);
								});
							} else {
								forEach(ast.properties, function(property) {
									self.recurse(property.value, ast.constant ? void 0 : self.nextId(), void 0, function(expr) {
										args.push(self.escape(property.key.type === AST.Identifier ? property.key.name : "" + property.key.value) + ":" + expr);
									});
								});
								expression = "{" + args.join(",") + "}";
								this.assign(intoId, expression);
							}
							recursionFn(intoId || expression);
							break;
						case AST.ThisExpression:
							this.assign(intoId, "s");
							recursionFn(intoId || "s");
							break;
						case AST.LocalsExpression:
							this.assign(intoId, "l");
							recursionFn(intoId || "l");
							break;
						case AST.NGValueParameter:
							this.assign(intoId, "v");
							recursionFn(intoId || "v");
					}
				},
				getHasOwnProperty: function(element, property) {
					var key = element + "." + property;
					var own = this.current().own;
					if (!own.hasOwnProperty(key)) own[key] = this.nextId(false, element + "&&(" + this.escape(property) + " in " + element + ")");
					return own[key];
				},
				assign: function(id, value) {
					if (!id) return;
					this.current().body.push(id, "=", value, ";");
					return id;
				},
				filter: function(filterName) {
					if (!this.state.filters.hasOwnProperty(filterName)) this.state.filters[filterName] = this.nextId(true);
					return this.state.filters[filterName];
				},
				ifDefined: function(id, defaultValue) {
					return "ifDefined(" + id + "," + this.escape(defaultValue) + ")";
				},
				plus: function(left, right) {
					return "plus(" + left + "," + right + ")";
				},
				return_: function(id) {
					this.current().body.push("return ", id, ";");
				},
				if_: function(test, alternate, consequent) {
					if (test === true) alternate();
					else {
						var body = this.current().body;
						body.push("if(", test, "){");
						alternate();
						body.push("}");
						if (consequent) {
							body.push("else{");
							consequent();
							body.push("}");
						}
					}
				},
				or_: function(expr1, expr2) {
					return "(" + expr1 + ") || (" + expr2 + ")";
				},
				hasProperty_: function(obj, prop, computed) {
					if (computed) return "(" + prop + " in " + obj + ")";
					else return "('" + prop + "' in " + obj + ")";
				},
				has_: function(obj, prop, computed) {
					return this.hasProperty_(obj, prop, computed);
				},
				and_: function(expr1, expr2) {
					return "(" + expr1 + ") && (" + expr2 + ")";
				},
				not: function(expression) {
					return "!(" + expression + ")";
				},
				isNull: function(expression) {
					return expression + "==null";
				},
				notNull: function(expression) {
					return expression + "!=null";
				},
				nonComputedMember: function(left, right) {
					var SAFE_IDENTIFIER = /^[$_a-zA-Z][$_a-zA-Z0-9]*$/;
					var UNSAFE_CHARACTERS = /[^$_a-zA-Z0-9]/g;
					var expr = "";
					if (SAFE_IDENTIFIER.test(right)) expr = left + "." + right;
					else {
						right = right.replace(UNSAFE_CHARACTERS, this.stringEscapeFn);
						expr = left + "[\"" + right + "\"]";
					}
					return expr;
				},
				unsafeComputedMember: function(left, right) {
					return left + "[" + right + "]";
				},
				unsafeNonComputedMember: function(left, right) {
					return this.nonComputedMember(left, right);
				},
				computedMember: function(left, right) {
					if (this.state.computing === "assign") return this.unsafeComputedMember(left, right);
					return "(" + left + ".hasOwnProperty(" + right + ") ? " + left + "[" + right + "] : null)";
				},
				unsafeMember: function(left, right, computed) {
					if (computed) return this.unsafeComputedMember(left, right);
					return this.unsafeNonComputedMember(left, right);
				},
				member: function(left, right, computed) {
					if (computed) return this.computedMember(left, right);
					return this.nonComputedMember(left, right);
				},
				getStringValue: function(item) {
					this.assign(item, "getStringValue(" + item + ")");
				},
				lazyRecurse: function(ast, intoId, nameId, recursionFn, create, skipWatchIdCheck) {
					var self = this;
					return function() {
						self.recurse(ast, intoId, nameId, recursionFn, create, skipWatchIdCheck);
					};
				},
				lazyAssign: function(id, value) {
					var self = this;
					return function() {
						self.assign(id, value);
					};
				},
				stringEscapeRegex: /[^ a-zA-Z0-9]/g,
				stringEscapeFn: function(c) {
					return "\\u" + ("0000" + c.charCodeAt(0).toString(16)).slice(-4);
				},
				escape: function(value) {
					if (isString(value)) return "'" + value.replace(this.stringEscapeRegex, this.stringEscapeFn) + "'";
					if (isNumber(value)) return value.toString();
					if (value === true) return "true";
					if (value === false) return "false";
					if (value === null) return "null";
					if (typeof value === "undefined") return "undefined";
					throw $parseMinErr("esc", "IMPOSSIBLE");
				},
				nextId: function(skip, init) {
					var id = "v" + this.state.nextId++;
					if (!skip) this.current().vars.push(id + (init ? "=" + init : ""));
					return id;
				},
				current: function() {
					return this.state[this.state.computing];
				}
			};
			/**
			* @constructor
			*/
			function Parser(lexer, $filter, options) {
				this.lexer = lexer;
				this.$filter = $filter;
				this.options = options;
				this.ast = new AST(lexer, options);
				this.astCompiler = new ASTCompiler(this.ast, $filter);
			}
			Parser.prototype = {
				constructor: Parser,
				parse: function(text) {
					return this.astCompiler.compile(text);
				}
			};
			/**
			* @ngdoc service
			* @name $parse
			* @kind function
			*
			* @description
			*
			* Converts Angular {@link guide/expression expression} into a function.
			*
			* ```js
			*   var getter = $parse('user.name');
			*   var setter = getter.assign;
			*   var context = {user:{name:'angular'}};
			*   var locals = {user:{name:'local'}};
			*
			*   expect(getter(context)).toEqual('angular');
			*   setter(context, 'newValue');
			*   expect(context.user.name).toEqual('newValue');
			*   expect(getter(context, locals)).toEqual('local');
			* ```
			*
			*
			* @param {string} expression String expression to compile.
			* @returns {function(context, locals)} a function which represents the compiled expression:
			*
			*    * `context` – `{object}` – an object against which any expressions embedded in the strings
			*      are evaluated against (typically a scope object).
			*    * `locals` – `{object=}` – local variables context object, useful for overriding values in
			*      `context`.
			*
			*    The returned function also has the following properties:
			*      * `literal` – `{boolean}` – whether the expression's top-level node is a JavaScript
			*        literal.
			*      * `constant` – `{boolean}` – whether the expression is made entirely of JavaScript
			*        constant literals.
			*      * `assign` – `{?function(context, value)}` – if the expression is assignable, this will be
			*        set to a function to change its value on the given context.
			*
			*/
			/**
			*
			* @param {object} data
			* @param {object} options
			*/
			function ScopeX(data, options) {
				var parserOptions = {
					expensiveChecks: true,
					literals: {
						true: true,
						false: false,
						null: null,
						undefined: void 0
					}
				};
				var filters = options && options.filters ? assign({}, options.filters) : {};
				var parser = new Parser(new Lexer({}), function getFilter(name) {
					return filters[name];
				}, parserOptions);
				var caches = {};
				/**
				* Compiles src and returns a function that executes src on a target object.
				* The compiled function is cached under caches[src] to speed up further calls.
				*
				* @param {string} src
				* @returns {function}
				*/
				function compile(src) {
					var cached;
					if (typeof src !== "string") throw new TypeError("ScopeX need a string, but saw " + typeof src);
					cached = caches[src];
					if (!cached) cached = caches[src] = parser.parse(src);
					return cached;
				}
				this.options = options;
				this.filters = filters;
				this.compile = compile;
				this.data = data ? data : {};
			}
			ScopeX.prototype.filter = function(name, fn) {
				this.filters[name] = fn;
			};
			ScopeX.prototype.parse = function(str) {
				return this.compile(str)(this.data);
			};
			ScopeX.prototype.assign = function(key, value) {
				this.compile(key).assign(this.data, value);
			};
			ScopeX.prototype.interpolate = function(str) {
				var reg = /* @__PURE__ */ new RegExp("{{(.*?)}}(?!})", "g");
				if (!str.match(reg)) return str;
				var $this = this;
				function convert(content) {
					var exp = content.trim().slice(2, -2);
					return $this.parse(exp);
				}
				str = str.replace(reg, convert);
				return str;
			};
			ScopeX.prototype.$new = function(locals) {
				locals = locals || {};
				var scopex = new ScopeX(isAbsObject(locals) ? setPrototypeOf(locals, this.data) : assign({}, locals), this.options);
				assign(scopex.filters, this.filters);
				return scopex;
			};
			function isAbsObject(value) {
				return value && typeof value === "object" && value.constructor === Object;
			}
			function hasOwnKey(obj, key) {
				return Object.prototype.hasOwnProperty.call(obj, key);
			}
			function assign(a, b) {
				for (var i in b) if (hasOwnKey(b, i)) a[i] = b[i];
				return a;
			}
			function setPrototypeOf(obj, proto) {
				if (Object.setPrototypeOf) Object.setPrototypeOf(obj, proto);
				else obj.__proto__ = proto;
				return obj;
			}
			function uniqueArray(items) {
				return items.reduce(function(res, key) {
					if (res.indexOf(key) > -1) return res;
					res.push(key);
					return res;
				}, []);
			}
			ScopeX.createScope = createScope;
			/**
			* @param {object} scopeVars
			* @param {object[]|string[]} chain
			* @returns new ScopeX()
			*/
			function createScope(scopeVars, options) {
				options = options || {};
				var chain = options.chain;
				var opts = assign({}, options);
				delete opts.chain;
				function ensureValue(value, target) {
					if (value && typeof value === "function") return value.bind(target);
					return value;
				}
				var data = null;
				var deps = [];
				var collecting = false;
				function inheritFrom(child, parent) {
					return new Proxy({}, {
						get: function(_, key) {
							var keyInChild = key in child;
							var keyInParent = key in parent;
							if (collecting && (keyInChild || keyInParent)) deps.push(key);
							if (keyInChild) return ensureValue(child[key], child);
							if (keyInParent) return ensureValue(parent[key], parent);
						},
						set: function(_, key, value) {
							if (key in child) child[key] = value;
							else if (key in parent) parent[key] = value;
							else child[key] = value;
							return true;
						},
						deleteProperty: function() {
							return false;
						},
						has: function(_, key) {
							if (key in child) return true;
							if (key in parent) return true;
							return false;
						},
						ownKeys: function() {
							var keys = [];
							for (var key in child) keys.push(key);
							for (key in parent) {
								if (keys.indexOf(key) > -1) continue;
								keys.push(key);
							}
							return keys;
						},
						getOwnPropertyDescriptor: function() {
							return {
								enumerable: true,
								configurable: true
							};
						}
					});
				}
				if (chain) data = new Proxy({}, {
					get: function(_, key) {
						for (var i = 0, len = chain.length; i < len; i++) {
							var item = chain[i];
							var isObj = typeof item === "object";
							var env = scopeVars[isObj ? item.key : item];
							if (!env) continue;
							var vars = isObj && item.getter ? item.getter(env) : env;
							if (key in vars) {
								if (collecting) deps.push(key);
								return ensureValue(vars[key], vars);
							}
						}
					},
					set: function(_, key, value) {
						var bottom;
						for (var i = 0, len = chain.length; i < len; i++) {
							var item = chain[i];
							var isObj = typeof item === "object";
							var env = scopeVars[isObj ? item.key : item];
							if (!env) continue;
							var vars = isObj && item.getter ? item.getter(env) : env;
							if (!bottom) bottom = vars;
							if (key in vars) {
								if (isObj && item.setter) item.setter(key, value, vars, env);
								else vars[key] = value;
								return true;
							}
						}
						if (bottom) bottom[key] = value;
						return true;
					},
					deleteProperty: function() {
						return false;
					},
					has: function(_, key) {
						for (var i = 0, len = chain.length; i < len; i++) {
							var item = chain[i];
							var isObj = typeof item === "object";
							var env = scopeVars[isObj ? item.key : item];
							if (!env) continue;
							if (key in (isObj && item.getter ? item.getter(env) : env)) return true;
						}
						return false;
					},
					ownKeys: function() {
						var keys = [];
						for (var i = 0, len = chain.length; i < len; i++) {
							var item = chain[i];
							var isObj = typeof item === "object";
							var env = scopeVars[isObj ? item.key : item];
							if (!env) continue;
							for (var key in isObj && item.getter ? item.getter(env) : env) keys.push(key);
						}
						return uniqueArray(keys);
					},
					getOwnPropertyDescriptor: function() {
						return {
							enumerable: true,
							configurable: true
						};
					}
				});
				else data = inheritFrom({}, scopeVars);
				var scope = new ScopeX(data, opts);
				if (chain) {
					scope.vars = scopeVars;
					Object.defineProperty(scope, "$new", { value: function(locals) {
						return createScope(setPrototypeOf(locals, scopeVars), options);
					} });
				} else Object.defineProperty(scope, "$new", { value: function(locals) {
					return createScope(inheritFrom(locals, data), options);
				} });
				var parse = scope.parse.bind(scope);
				Object.defineProperty(scope, "parse", { value: function(exp, fn) {
					if (fn) collecting = true;
					var res = parse(exp);
					if (fn) {
						fn(uniqueArray(deps));
						deps.length = 0;
						collecting = false;
					}
					return res;
				} });
				return scope;
			}
			return ScopeX;
		});
	}));

// src/utils.js
	var import_ScopeX = require_ScopeX();
	const isNone = (v) => v === null || v === void 0;
	const isFunction = (v) => typeof v === "function";
	const isString = (v) => typeof v === "string";
	const isObject = (v) => v !== null && typeof v === "object";
	function isEqual(a, b, depth = 0) {
		if (a === b) return true;
		if (depth > 6 || !a || !b || typeof a !== "object" || typeof b !== "object") return a !== a && b !== b;
		if (Array.isArray(a) !== Array.isArray(b)) return false;
		const ka = Object.keys(a), kb = Object.keys(b);
		if (ka.length !== kb.length) return false;
		for (const k of ka) if (!isEqual(a[k], b[k], depth + 1)) return false;
		return true;
	}
	function getNodeAttrs(el) {
		const attrs = {};
		const list = el.attributes;
		for (let i = 0; i < list.length; i++) attrs[list[i].name] = list[i].value;
		return attrs;
	}
	function camelCase(str) {
		return str.split(/\W|_/).filter((item) => !!item).map((item, i) => i === 0 ? item : item.replace(item[0], item[0].toUpperCase())).join("");
	}
	function parseKey(str) {
		const [, name, , _params] = str.match(/([a-zA-Z0-9_$]+)(\((.*?)\))?/);
		return [name, isString(_params) ? _params.split(",").map((item) => item.trim()).filter((item) => !!item) : void 0];
	}
	const mustacheCache = /* @__PURE__ */ new Map();
	function parseMustache(str) {
		let parts = mustacheCache.get(str);
		if (!parts) {
			parts = [];
			const re = /\{\{(.*?)\}\}(?!\})/g;
			let last = 0, m;
			while (m = re.exec(str)) {
				if (m.index > last) parts.push(str.slice(last, m.index));
				parts.push({ expr: m[1].trim() });
				last = re.lastIndex;
			}
			if (parts.length && last < str.length) parts.push(str.slice(last));
			if (mustacheCache.size > 5e3) mustacheCache.clear();
			mustacheCache.set(str, parts);
		}
		return parts;
	}

// src/store.js
	var VMLocalStorage = class {
		static getKey = (key) => "JQVM_ls_" + key;
		static getVal = (key) => {
			try {
				const raw = localStorage.getItem(this.getKey(key));
				return raw === null ? null : JSON.parse(raw);
			} catch (e) {
				return null;
			}
		};
		static setVal = (key, val) => {
			try {
				const next = JSON.stringify(val === void 0 ? null : val);
				const k = this.getKey(key);
				if (localStorage.getItem(k) !== next) localStorage.setItem(k, next);
			} catch (e) {}
		};
		static revive = (stored, def) => {
			if (typeof stored === "string" && typeof def !== "string" && def !== void 0 && def !== null) try {
				return JSON.parse(stored);
			} catch (e) {
				return def;
			}
			return stored;
		};
		static reloadJqvmLocalStorage = (state, status) => {
			const st = state && state.storage;
			if (!st || typeof st !== "object") return;
			Object.keys(st).forEach((name) => {
				if (status === "$mount") {
					const stored = this.getVal(name);
					if (stored === null) this.setVal(name, st[name]);
					else st[name] = this.revive(stored, st[name]);
				} else if (status === "$change") this.setVal(name, st[name]);
			});
		};
	};

// src/reactive.js
	const RAW = Symbol("wex.raw");
	const ITERATE = Symbol("wex.iterate");
	const proxies = /* @__PURE__ */ new WeakMap();
	const targetMap = /* @__PURE__ */ new WeakMap();
	const subs = /* @__PURE__ */ new WeakMap();
	const parents = /* @__PURE__ */ new WeakMap();
	let subCount = 0;
	let mutations = 0;
	let afterFlush = null;
	const mutationCount = () => mutations;
	const setAfterFlush = (fn) => {
		afterFlush = fn;
	};
	let activeEffect = null;
	let seq = 0;
	const hasOwn = (o, k) => Object.prototype.hasOwnProperty.call(o, k);
	const isPlain = (v) => {
		if (v === null || typeof v !== "object") return false;
		if (Array.isArray(v)) return true;
		const p = Object.getPrototypeOf(v);
		return p === Object.prototype || p === null || p !== void 0 && Object.getPrototypeOf(p) === null;
	};
	const toRaw = (v) => v && typeof v === "object" && v[RAW] || v;
	const isReactive = (v) => !!(v && typeof v === "object" && v[RAW]);
	var Effect = class {
		constructor(fn) {
			this.fn = fn;
			this.id = ++seq;
			this.deps = null;
			this.active = true;
			this.queued = false;
			this.view = null;
		}
		run() {
			if (!this.active) return;
			cleanup(this);
			const prev = activeEffect;
			activeEffect = this;
			try {
				return this.fn();
			} finally {
				activeEffect = prev;
			}
		}
		stop() {
			if (this.active) {
				cleanup(this);
				this.active = false;
			}
		}
	};
	function cleanup(e) {
		const d = e.deps;
		if (d === null || d.length === 0) return;
		for (let i = 0; i < d.length; i += 2) {
			const m = d[i], k = d[i + 1];
			const c = m.get(k);
			if (c === e) m.delete(k);
			else if (c !== void 0) c.delete(e);
		}
		d.length = 0;
	}
	const probe = new Effect(null);
	function runLeaf(run, a, b, c, d) {
		const prev = activeEffect;
		activeEffect = probe;
		probe.deps = null;
		try {
			run(a, b, c, d);
		} finally {
			activeEffect = prev;
		}
		const deps = probe.deps;
		if (deps === null || deps.length === 0) return null;
		probe.deps = null;
		const e = new Effect(() => run(a, b, c, d));
		for (let i = 0; i < deps.length; i += 2) {
			const m = deps[i], k = deps[i + 1];
			const cur = m.get(k);
			if (cur === probe) m.set(k, e);
			else {
				cur.delete(probe);
				cur.add(e);
			}
		}
		e.deps = deps;
		return e;
	}
	function untrack(fn) {
		const prev = activeEffect;
		activeEffect = null;
		try {
			return fn();
		} finally {
			activeEffect = prev;
		}
	}
	function track(target, key) {
		const e = activeEffect;
		if (!e) return;
		let m = targetMap.get(target);
		if (!m) targetMap.set(target, m = /* @__PURE__ */ new Map());
		const cur = m.get(key);
		if (cur === void 0) {
			m.set(key, e);
			(e.deps || (e.deps = [])).push(m, key);
		} else if (cur === e) return;
		else if (cur instanceof Set) {
			if (!cur.has(e)) {
				cur.add(e);
				(e.deps || (e.deps = [])).push(m, key);
			}
		} else {
			m.set(key, /* @__PURE__ */ new Set([cur, e]));
			(e.deps || (e.deps = [])).push(m, key);
		}
	}
	function trigger(target, key, type, newLen) {
		const m = targetMap.get(target);
		if (!m) return;
		const add = (dep) => {
			if (dep === void 0) return;
			if (dep instanceof Set) dep.forEach((e) => {
				if (e !== activeEffect) enqueue(e);
			});
			else if (dep !== activeEffect) enqueue(dep);
		};
		const isArr = Array.isArray(target);
		if (isArr) add(m.get(ITERATE));
		if (isArr && key === "length") {
			m.forEach((dep, k) => {
				if (k === "length" || typeof k === "string" && +k >= newLen) add(dep);
			});
			return;
		}
		if (key !== void 0) add(m.get(key));
		if (type === "add" || type === "delete") add(m.get(isArr ? "length" : ITERATE));
	}
	function readList(src) {
		const raw = toRaw(src);
		track(raw, ITERATE);
		const n = raw.length;
		const out = new Array(n);
		for (let i = 0; i < n; i++) {
			const v = raw[i];
			if (v !== null && typeof v === "object" && isPlain(v)) {
				if (subCount) link(toRaw(v), raw);
				out[i] = reactive(v);
			} else out[i] = v;
		}
		return out;
	}
	const queue = /* @__PURE__ */ new Set();
	let pending = false;
	let flushId = 0;
	const byId = (a, b) => a.id - b.id;
	function enqueue(e) {
		if (e.queued) return;
		e.queued = true;
		queue.add(e);
		if (!pending) {
			pending = true;
			Promise.resolve().then(flush);
		}
	}
	function runEffects(list) {
		list.sort(byId);
		for (const e of list) {
			if (!e.active) continue;
			try {
				e.run();
			} catch (err) {
				console.error(err);
			}
		}
	}
	function flush() {
		pending = false;
		let guard = 0;
		while (queue.size && guard++ < 100) {
			const list = Array.from(queue);
			queue.clear();
			list.sort(byId);
			flushId++;
			for (const e of list) {
				e.queued = false;
				if (!e.active) continue;
				const v = e.view;
				if (v && !v.__gate(flushId)) {
					v.skipped.add(e);
					continue;
				}
				try {
					e.run();
				} catch (err) {
					console.error(err);
				}
			}
		}
		if (queue.size) {
			console.error("Wex: бесконечный цикл обновлений");
			queue.forEach((e) => {
				e.queued = false;
			});
			queue.clear();
		}
		if (afterFlush) afterFlush();
	}
	function link(child, parent) {
		let set = parents.get(child);
		if (!set) parents.set(child, set = /* @__PURE__ */ new Set());
		if (!set.has(parent)) set.add(parent);
	}
	function notify(raw, info) {
		const seen = /* @__PURE__ */ new Set();
		const fns = /* @__PURE__ */ new Set();
		const stack = [raw];
		while (stack.length) {
			const cur = stack.pop();
			if (seen.has(cur)) continue;
			seen.add(cur);
			const s = subs.get(cur);
			if (s) s.forEach((fn) => fns.add(fn));
			const p = parents.get(cur);
			if (p) p.forEach((x) => stack.push(x));
		}
		fns.forEach((fn) => {
			try {
				fn(info);
			} catch (e) {
				console.error(e);
			}
		});
	}
	function subscribe(target, fn) {
		const raw = toRaw(target);
		let set = subs.get(raw);
		if (!set) subs.set(raw, set = /* @__PURE__ */ new Set());
		set.add(fn);
		subCount++;
		return () => {
			if (set.delete(fn)) subCount--;
		};
	}
	const searchers = {};
	[
		"includes",
		"indexOf",
		"lastIndexOf"
	].forEach((name) => {
		searchers[name] = function(...args) {
			const raw = toRaw(this);
			let res = raw[name](...args);
			if (res === false || res === -1) res = raw[name](...args.map(toRaw));
			return res;
		};
	});
	const handler = {
		get(target, key) {
			if (key === RAW) return target;
			if (Array.isArray(target) && hasOwn(searchers, key)) return searchers[key];
			const value = Reflect.get(target, key);
			if (typeof key === "symbol") return value;
			if (activeEffect) track(target, key);
			if (!isPlain(value)) return value;
			const d = Object.getOwnPropertyDescriptor(target, key);
			if (d && !d.configurable && !d.writable) return value;
			const raw = toRaw(value);
			if (subCount) link(raw, target);
			return reactive(raw);
		},
		has(target, key) {
			if (activeEffect && typeof key !== "symbol") track(target, key);
			return Reflect.has(target, key);
		},
		ownKeys(target) {
			if (activeEffect) track(target, Array.isArray(target) ? "length" : ITERATE);
			return Reflect.ownKeys(target);
		},
		set(target, key, value) {
			const next = toRaw(value);
			const had = hasOwn(target, key);
			const prev = target[key];
			const ok = Reflect.set(target, key, next);
			if (ok && (!had || prev !== next)) {
				if (isPlain(next)) link(next, target);
				const type = had ? "set" : "add";
				mutations++;
				if (subCount) notify(target, {
					target,
					key,
					type
				});
				trigger(target, key, type, Array.isArray(target) && key === "length" ? next : void 0);
			}
			return ok;
		},
		deleteProperty(target, key) {
			const had = hasOwn(target, key);
			const ok = Reflect.deleteProperty(target, key);
			if (ok && had) {
				mutations++;
				if (subCount) notify(target, {
					target,
					key,
					type: "delete"
				});
				trigger(target, key, "delete");
			}
			return ok;
		}
	};
	function reactive(value) {
		if (!isPlain(value)) return value;
		const raw = toRaw(value);
		let p = proxies.get(raw);
		if (!p) {
			if (Object.isFrozen(raw)) return raw;
			p = new Proxy(raw, handler);
			proxies.set(raw, p);
		}
		return p;
	}

// src/wex.js
	var wex_exports = /* @__PURE__ */ __exportAll({
		OPS: () => OPS,
		View: () => View,
		WEX_VERSION: () => WEX_VERSION,
		__flush: () => flush,
		component: () => component$2,
		config: () => config,
		createView: () => createView,
		directive: () => directive$2,
		effect: () => effect,
		ev: () => ev,
		filter: () => filter,
		getDollar: () => getDollar,
		getPlan: () => getPlan,
		instNodes: () => instNodes,
		instantiate: () => instantiate,
		isReactive: () => isReactive,
		mountComponent: () => mountComponent,
		postTask: () => postTask,
		preloadComponent: () => preloadComponent,
		reactive: () => reactive,
		report: () => report,
		runPost: () => runPost,
		setDollar: () => setDollar,
		toRaw: () => toRaw,
		untrack: () => untrack,
		view: () => view
	});
	const WEX_VERSION = "3.0.0";
	let $ = null;
	const setDollar = (d) => {
		$ = d;
	};
	const getDollar = () => $;
	const config = {
		autoForce: false,
		debug: typeof window !== "undefined" && window.WEX_DEBUG !== void 0 ? !!window.WEX_DEBUG : typeof location !== "undefined" && /^(localhost|127\.|\[::1\])/.test(location.hostname),
		maxDepth: 50
	};
	const stats = typeof window !== "undefined" && window.WEX_PROFILE ? window.WEX_STATS = {
		instantiate: 0,
		list: 0,
		rows: 0
	} : null;
	function View() {}
	const reported = /* @__PURE__ */ new Set();
	function report(title, ctx = {}) {
		const level = ctx.level || "warn";
		if (level !== "error" && !config.debug) return;
		const path = ctx.view && ctx.view.__path || ["root"];
		const key = [
			title,
			path.join(">"),
			ctx.attr,
			ctx.expr
		].join("|");
		if (reported.has(key)) return;
		reported.add(key);
		const color = level === "error" ? "#e11d48" : "#d97706";
		console.groupCollapsed(`%cWex%c ${title}`, `background:${color};color:#fff;padding:1px 5px;border-radius:3px`, "");
		console.log("Цепочка компонентов:", path.join(" › "));
		if (ctx.attr) console.log("Атрибут:", ctx.attr);
		if (ctx.expr) console.log("Выражение:", ctx.expr);
		if (ctx.hint) console.log("Подсказка:", ctx.hint);
		console.groupEnd();
	}
	const globalScope = new import_ScopeX.ScopeX({}, { filters: {} });
	const globalComponents = /* @__PURE__ */ new Map();
	const globalDirectives = /* @__PURE__ */ new Map();
	let globalVer = 0;
	function filter(name, fn) {
		globalScope.filters[name] = fn;
	}
	function normDirective(compile, affect) {
		if (compile && typeof compile === "object" && !(compile instanceof View)) return {
			compile: compile.compile || null,
			affect: null,
			life: compile
		};
		if (compile && !isFunction(compile)) throw new Error("Wex: directive(name, compile, affect, priority)");
		return {
			compile: compile || null,
			affect: affect || null,
			life: null
		};
	}
	function directive$2(name, compile, affect, priority) {
		globalDirectives.set(name, normDirective(compile, affect));
		globalVer++;
	}
	function normComponent(name, src, extra) {
		if (src instanceof View) return { view: src };
		if (isString(src)) return { remote: loadRemote(src, extra) };
		if (isFunction(src)) return { legacy: {
			compile: src,
			affect: isFunction(extra) ? extra : null
		} };
		throw new Error(`Wex: component("${name}") принимает View, URL или функцию compile($el, attrs, slot)`);
	}
	function component$2(name, src, extra) {
		globalComponents.set(name.toLowerCase(), normComponent(name, src, extra));
		globalVer++;
	}
	let postQ = [];
	let postDepth = 0;
	function postTask(fn) {
		postQ.push(fn);
		if (postDepth === 0) Promise.resolve().then(runPost);
	}
	function runPost() {
		if (postDepth) return;
		while (postQ.length) {
			const q = postQ;
			postQ = [];
			q.forEach((f) => {
				try {
					f();
				} catch (e) {
					console.error(e);
				}
			});
		}
	}
	setAfterFlush(runPost);
	var Block = class {
		constructor(parent, view) {
			this.view = view;
			this.parent = parent || null;
			this.effects = null;
			this.cleanups = null;
			this.children = null;
			this.disposed = false;
			this.static = parent ? parent.static : false;
			this.linked = false;
		}
		link() {
			if (this.linked) return;
			this.linked = true;
			const p = this.parent;
			if (p) {
				(p.children || (p.children = /* @__PURE__ */ new Set())).add(this);
				p.link();
			}
		}
		onDispose(fn) {
			this.link();
			(this.cleanups || (this.cleanups = [])).push(fn);
		}
		dispose() {
			if (this.disposed) return;
			this.disposed = true;
			const ef = this.effects;
			if (ef) for (let i = 0; i < ef.length; i++) ef[i].stop();
			if (this.children) Array.from(this.children).forEach((c) => c.dispose());
			if (this.cleanups) this.cleanups.forEach((f) => {
				try {
					f();
				} catch (e) {
					console.error(e);
				}
			});
			if (this.linked && this.parent && this.parent.children) this.parent.children.delete(this);
			this.effects = null;
		}
	};
	function effect(block, fn) {
		if (block.static) {
			untrack(fn);
			return null;
		}
		const e = new Effect(fn);
		e.view = block.view;
		e.run();
		if (e.deps === null || e.deps.length === 0) {
			e.active = false;
			return null;
		}
		(block.effects || (block.effects = [])).push(e);
		block.link();
		return e;
	}
	function leaf(block, run, a, b, c, d) {
		if (block.static) {
			untrack(() => run(a, b, c, d));
			return;
		}
		const e = runLeaf(run, a, b, c, d);
		if (e === null) return;
		e.view = block.view;
		(block.effects || (block.effects = [])).push(e);
		block.link();
	}
	function collectAll(block, out) {
		if (block.effects) block.effects.forEach((e) => {
			if (e.active) out.push(e);
		});
		if (block.children) block.children.forEach((c) => collectAll(c, out));
	}
	function collectEffects(block, view, out) {
		if (block.effects) block.effects.forEach((e) => {
			if (e.active && e.view === view) out.push(e);
		});
		if (block.children) block.children.forEach((c) => collectEffects(c, view, out));
	}
	const PATH_RE = /^[A-Za-z_$][\w$]*(\.[A-Za-z_$][\w$]*)*$/;
	const RESERVED = /* @__PURE__ */ new Set([
		"true",
		"false",
		"null",
		"undefined",
		"this",
		"$locals"
	]);
	function makeFn(sc, expr) {
		if (PATH_RE.test(expr) && !RESERVED.has(expr.split(".")[0])) {
			const keys = expr.split("."), n = keys.length, k0 = keys[0];
			if (n === 1) return (s) => s[k0];
			if (n === 2) {
				const k1 = keys[1];
				return (s) => {
					const a = s[k0];
					return a == null ? void 0 : a[k1];
				};
			}
			return (s) => {
				let v = s[k0];
				for (let i = 1; i < n && v != null; i++) v = v[keys[i]];
				return v;
			};
		}
		return sc.compile(expr);
	}
	function ev(view, h, data, ctx) {
		try {
			const sc = view.__scope();
			if (typeof h === "string") return sc.compile(h)(data);
			let fn = h.fn;
			if (h.sc !== sc) {
				fn = h.fn = makeFn(sc, h.expr);
				h.sc = sc;
			}
			return fn(data);
		} catch (e) {
			const expr = typeof h === "string" ? h : h.expr;
			report(`Ошибка в выражении «${expr}»: ${e.message}`, {
				view,
				attr: ctx && ctx.attr,
				expr,
				level: "error"
			});
			return;
		}
	}
	const planCache = /* @__PURE__ */ new Map();
	const WFOR_RE = /^\s*([A-Za-z_$][\w$]*)\s*(?:,\s*([A-Za-z_$][\w$]*))?\s+in\s+([\s\S]+?)(?:\s+traceby\s+([\s\S]+?))?\s*$/;
	const BUILTIN = /* @__PURE__ */ new Set([
		"w-class",
		"w-value",
		"w-disabled",
		"w-checked",
		"w-selected",
		"w-bind",
		"w-src",
		"w-html",
		"w-id",
		"w-on",
		"w-transition"
	]);
	function getPlan(html, view) {
		const sig = view.__sig();
		let m = planCache.get(sig);
		if (!m) planCache.set(sig, m = /* @__PURE__ */ new Map());
		let plan = m.get(html);
		if (!plan) {
			const tpl = document.createElement("template");
			tpl.innerHTML = html;
			plan = makePlan(tpl.content, view.__env());
			if (m.size > 2e3) m.clear();
			m.set(html, plan);
		}
		return plan;
	}
	function makePlan(frag, env) {
		const ops = [];
		walk(frag, [], ops, env);
		const kids = frag.childNodes;
		return {
			frag,
			ops,
			rootEl: kids.length === 1 && kids[0].nodeType === 1 && !ops.some((o) => o.path.length === 1 && (o.t === "if" || o.t === "for" || o.t === "slot" || o.replace)) ? kids[0] : null
		};
	}
	function fragOf(node) {
		const f = node.ownerDocument.createDocumentFragment();
		f.appendChild(node);
		return f;
	}
	function walk(parent, path, ops, env) {
		const kids = parent.childNodes;
		for (let i = 0; i < kids.length; i++) {
			const node = kids[i];
			if (node.nodeType === 3) {
				if (node.data.indexOf("{{") !== -1) {
					const parts = parseMustache(node.data);
					if (parts.length) ops.push({
						t: "text",
						path: path.concat(i),
						parts
					});
				}
			} else if (node.nodeType === 1) planElement(node, path.concat(i), ops, env, parent);
		}
	}
	function planElement(el, path, ops, env, parent) {
		const doc = el.ownerDocument;
		const tag = el.localName;
		if (el.hasAttribute("w-for")) {
			const attr = el.getAttribute("w-for");
			const m = WFOR_RE.exec(attr);
			if (!m) throw new Error("w-for should match formatter `value, index in data` (ключ: `traceby expr` или атрибут w-key=\"expr\")");
			const vname = m[1];
			const kname = m[2];
			const list = m[3].trim();
			const trace = (m[4] || el.getAttribute("w-key") || "").trim() || void 0;
			const row = el.cloneNode(true);
			row.removeAttribute("w-for");
			row.removeAttribute("w-key");
			parent.replaceChild(doc.createComment(" w-for "), el);
			ops.push({
				t: "for",
				path,
				vname,
				kname,
				list,
				trace,
				listH: { expr: list },
				traceH: trace ? { expr: trace } : null,
				sub: makePlan(fragOf(row), env)
			});
			return;
		}
		if (el.hasAttribute("w-if")) {
			const expr = el.getAttribute("w-if");
			const row = el.cloneNode(true);
			row.removeAttribute("w-if");
			parent.replaceChild(doc.createComment(" w-if "), el);
			ops.push({
				t: "if",
				path,
				expr,
				sub: makePlan(fragOf(row), env)
			});
			return;
		}
		if (tag === "slot") {
			const props = {};
			for (const a of getNodeAttrs(el) && [...el.attributes]) if (a.name[0] === ":") props[camelCase(a.name.slice(1))] = a.value;
			const f = doc.createDocumentFragment();
			while (el.firstChild) f.appendChild(el.firstChild);
			const fallback = f.childNodes.length ? makePlan(f, env) : null;
			parent.replaceChild(doc.createComment(" slot "), el);
			ops.push({
				t: "slot",
				path,
				props,
				fallback
			});
			return;
		}
		if (tag === "w-static" || env.comps.has(tag)) {
			const entry = env.comps.get(tag);
			const attrs = getNodeAttrs(el);
			const slotHtml = entry && entry.legacy ? el.innerHTML : null;
			[...el.attributes].forEach((a) => {
				if (a.name[0] === ":" || a.name[0] === "@") el.removeAttribute(a.name);
			});
			const f = doc.createDocumentFragment();
			while (el.firstChild) f.appendChild(el.firstChild);
			const slotPlan = f.childNodes.length && (f.childElementCount || f.textContent.trim()) ? makePlan(f, env) : null;
			planAttrs(el, path, ops, env);
			const replace = !!entry && (!!entry.legacy || !!entry.view && entry.view.tag !== "template");
			ops.push({
				t: "comp",
				path,
				name: tag,
				attrs,
				slotPlan,
				slotHtml,
				replace
			});
			return;
		}
		planAttrs(el, path, ops, env);
		walk(el, path, ops, env);
	}
	function planAttrs(el, path, ops, env) {
		const list = [...el.attributes];
		for (let i = 0; i < list.length; i++) {
			const { name, value } = list[i];
			if (BUILTIN.has(name)) {
				el.removeAttribute(name);
				if (name === "w-on") {
					const [event, method] = value.split(":");
					const [fname, params] = parseKey(method);
					ops.push({
						t: "on",
						path,
						event,
						fname,
						params
					});
				} else ops.push({
					t: name,
					path,
					expr: value
				});
			} else if (env.dirs.has(name)) {
				const def = env.dirs.get(name);
				ops.push({
					t: "dir",
					path,
					name,
					expr: value,
					attrs: getNodeAttrs(el),
					replace: !!def.compile
				});
			} else if (name.charCodeAt(0) !== 64 && name.charCodeAt(0) !== 58 && value.indexOf("{{") !== -1) {
				if (config.debug && /^(src|href|srcset)$/.test(name)) report("«{{ }}» внутри src/href: браузер запросит сырую строку и получит 404", {
					level: "error",
					attr: name,
					hint: "Используйте w-src=\"выражение\""
				});
				const parts = parseMustache(value);
				if (parts.length) ops.push({
					t: "attr",
					path,
					name,
					parts,
					whole: /^\{\{[^}]+\}\}$/.test(value.trim())
				});
			}
		}
	}
	function buildResolver(plan) {
		const ops = plan.ops;
		if (!ops.length) return null;
		const start = plan.rootEl ? 1 : 0;
		const base = plan.rootEl ? "el" : "f";
		const parts = ops.map((op) => {
			let e = base;
			const p = op.path;
			for (let j = start; j < p.length; j++) if (p[j] > 8) e += ".childNodes[" + p[j] + "]";
			else {
				e += ".firstChild";
				for (let k = 0; k < p[j]; k++) e += ".nextSibling";
			}
			return e;
		});
		return new Function(base, "return [" + parts.join(",") + "]");
	}
	function instantiate(plan, view, data, parentBlock, opts) {
		const block = new Block(parentBlock, view);
		if (opts && opts.static) block.static = true;
		const ops = plan.ops;
		const n = ops.length;
		let inst;
		if (plan.rootEl) {
			const el = plan.rootEl.cloneNode(true);
			inst = {
				frag: null,
				block,
				rootItems: null,
				simple: true,
				el
			};
			if (n) {
				const refs = (plan.res === void 0 ? plan.res = buildResolver(plan) : plan.res)(el);
				for (let i = 0; i < n; i++) applyOp(ops[i], refs[i], view, data, block);
			}
			return inst;
		}
		const frag = plan.frag.cloneNode(true);
		const refs = n ? (plan.res === void 0 ? plan.res = buildResolver(plan) : plan.res)(frag) : null;
		inst = {
			frag,
			block,
			rootItems: Array.from(frag.childNodes),
			simple: false,
			el: null
		};
		for (let i = 0; i < n; i++) applyOp(ops[i], refs[i], view, data, block);
		return inst;
	}
	function instNodes(inst) {
		if (inst.simple) return [inst.el];
		const out = [];
		for (const n of inst.rootItems) if (n.__dyn) out.push(...n.__dyn.nodes());
		else out.push(n);
		return out;
	}
	function instFirst(inst) {
		return inst.simple ? inst.el : instNodes(inst)[0];
	}
	function instMove(inst, parent, ref) {
		if (inst.simple) parent.insertBefore(inst.el, ref);
		else if (inst.frag.firstChild) parent.insertBefore(inst.frag, ref);
		else instNodes(inst).forEach((n) => parent.insertBefore(n, ref));
	}
	function instRemove(inst) {
		if (inst.simple) inst.el.remove();
		else instNodes(inst).forEach((n) => n.remove());
	}
	const OPS = Object.create(null);
	function applyOp(op, node, view, data, block) {
		switch (op.t) {
			case "text": return bindText(op, node, view, data, block);
			case "attr": return bindAttr(op, node, view, data, block);
			case "if": return bindIf(op, node, view, data, block);
			case "for": return bindFor(op, node, view, data, block);
			case "slot": return bindSlot(op, node, view, data, block);
			case "comp": return bindComp(op, node, view, data, block);
			default: return OPS[op.t](op, node, view, data, block);
		}
	}
	function textRun(op, node, view, data) {
		const parts = op.parts;
		let s = "";
		for (let i = 0; i < parts.length; i++) {
			const p = parts[i];
			if (typeof p === "string") s += p;
			else {
				const v = ev(view, p, data, op);
				if (config.debug && isNone(v)) report(`«{{ ${p.expr} }}» вернул ${v}`, {
					view,
					expr: p.expr
				});
				s += String(v);
			}
		}
		if (node.data !== s) node.data = s;
	}
	function bindText(op, node, view, data, block) {
		leaf(block, textRun, op, node, view, data);
	}
	function attrRun(op, el, view, data) {
		const { name, parts } = op;
		if (op.whole) {
			const v = ev(view, parts[0], data, op);
			if (isNone(v)) {
				el.removeAttribute(name);
				return;
			}
			const s = String(v);
			if (el.getAttribute(name) !== s) el.setAttribute(name, s);
			return;
		}
		let s = "";
		for (let i = 0; i < parts.length; i++) {
			const p = parts[i];
			s += typeof p === "string" ? p : String(ev(view, p, data, op));
		}
		if (el.getAttribute(name) !== s) el.setAttribute(name, s);
	}
	function bindAttr(op, el, view, data, block) {
		leaf(block, attrRun, op, el, view, data);
	}
	function bindIf(op, anchor, view, data, block) {
		let inst = null;
		if (op.path.length === 1) anchor.__dyn = { nodes: () => inst ? instNodes(inst).concat(anchor) : [anchor] };
		effect(block, () => {
			if (!!ev(view, op, data, op)) {
				if (!inst) {
					inst = untrack(() => instantiate(op.sub, view, data, block));
					instMove(inst, anchor.parentNode, anchor);
				}
			} else if (inst) {
				instRemove(inst);
				inst.block.dispose();
				inst = null;
			}
		});
	}
	function lis(arr) {
		const n = arr.length;
		const res = new Array(n).fill(false);
		const tails = [];
		const prev = new Array(n).fill(-1);
		for (let i = 0; i < n; i++) {
			const v = arr[i];
			if (v < 0) continue;
			let lo = 0, hi = tails.length;
			while (lo < hi) {
				const mid = lo + hi >> 1;
				if (arr[tails[mid]] < v) lo = mid + 1;
				else hi = mid;
			}
			if (lo > 0) prev[i] = tails[lo - 1];
			tails[lo] = i;
		}
		let k = tails.length ? tails[tails.length - 1] : -1;
		while (k >= 0) {
			res[k] = true;
			k = prev[k];
		}
		return res;
	}
	function own(o, k, v) {
		Object.defineProperty(o, k, {
			value: v,
			writable: true,
			enumerable: true,
			configurable: true
		});
	}
	function bindFor(op, anchor, view, data, block) {
		const { vname, kname, trace } = op;
		const mk = op.mk || (op.mk = new Function("d", "i", "return {__proto__:d," + JSON.stringify(vname) + ":i}"));
		const rows = /* @__PURE__ */ new Map();
		let order = [];
		let stamp = 0;
		if (op.path.length === 1) anchor.__dyn = { nodes() {
			const out = [];
			for (const r of order) out.push(...instNodes(r.inst));
			out.push(anchor);
			return out;
		} };
		const scratch = trace ? mk(data, void 0) : null;
		if (trace && kname) own(scratch, kname, void 0);
		const createRow = (item, key, kv) => {
			const rd = mk(data, item);
			let kh = null;
			if (kname) {
				kh = { v: kv };
				Object.defineProperty(rd, kname, {
					get() {
						track(kh, "v");
						return kh.v;
					},
					enumerable: true,
					configurable: true
				});
			}
			const inst = instantiate(op.sub, view, rd, block);
			if (trace && key !== void 0 && inst.simple && inst.el.nodeType === 1) inst.el.setAttribute("data-id", key);
			if (stats) stats.rows++;
			return {
				key,
				raw: toRaw(item),
				inst,
				kh,
				idx: 0,
				rd,
				stamp
			};
		};
		const dropRow = (r) => {
			instRemove(r.inst);
			r.inst.block.dispose();
		};
		effect(block, () => {
			const t0 = stats ? performance.now() : 0;
			const src = ev(view, op.listH, data, op);
			let items, kvs = null, n = 0;
			if (Array.isArray(src)) {
				items = readList(src);
				n = items.length;
			} else if (!isNone(src) && typeof src === "object") {
				kvs = Object.keys(src);
				n = kvs.length;
				items = new Array(n);
				for (let i = 0; i < n; i++) items[i] = src[kvs[i]];
			} else items = [];
			if (config.debug && n === 0 && Array.isArray(src)) report(`w-for «${op.list}»: массив пустой`, {
				view,
				expr: op.list
			});
			let keys = kvs;
			if (trace) {
				keys = new Array(n);
				const seen = /* @__PURE__ */ new Set();
				for (let i = 0; i < n; i++) {
					scratch[vname] = items[i];
					if (kname) scratch[kname] = kvs ? kvs[i] : i;
					let k = ev(view, op.traceH, scratch, op);
					if (seen.has(k)) {
						let j = 1;
						while (seen.has(k + "#" + j)) j++;
						k = k + "#" + j;
					}
					seen.add(k);
					keys[i] = k;
				}
			}
			untrack(() => {
				const parent = anchor.parentNode;
				stamp++;
				const newRows = new Array(n);
				if (rows.size === 0) {
					const f = n > 16 ? anchor.ownerDocument.createDocumentFragment() : parent;
					const ref = n > 16 ? null : anchor;
					for (let i = 0; i < n; i++) {
						const key = keys ? keys[i] : i;
						const r = createRow(items[i], key, kvs ? kvs[i] : i);
						r.idx = i;
						newRows[i] = r;
						rows.set(key, r);
						instMove(r.inst, f, ref);
					}
					if (n > 16) parent.insertBefore(f, anchor);
					order = newRows;
					return;
				}
				const srcIdx = new Array(n);
				let refresh = null, inOrder = true, last = -1, hasNew = false, claimed = 0, removed = false;
				for (let i = 0; i < n; i++) {
					const key = keys ? keys[i] : i;
					let r = rows.get(key);
					if (r) {
						const raw = toRaw(items[i]);
						if (r.raw !== raw) {
							if (typeof raw !== "object" || raw === null) {
								dropRow(r);
								rows.delete(key);
								r = void 0;
								removed = true;
							} else {
								r.raw = raw;
								r.rd[vname] = items[i];
								(refresh || (refresh = [])).push(r);
							}
						}
					}
					if (r) {
						r.stamp = stamp;
						claimed++;
						if (r.kh && r.kh.v !== (kvs ? kvs[i] : i)) {
							r.kh.v = kvs ? kvs[i] : i;
							trigger(r.kh, "v", "set");
						}
						newRows[i] = r;
						const ix = r.idx;
						srcIdx[i] = ix;
						if (ix < last) inOrder = false;
						last = ix;
					} else {
						newRows[i] = null;
						srcIdx[i] = -1;
						hasNew = true;
					}
				}
				if (rows.size > claimed) rows.forEach((r, key) => {
					if (r.stamp !== stamp) {
						dropRow(r);
						rows.delete(key);
						removed = true;
					}
				});
				if (hasNew || !inOrder || removed) {
					const stable = inOrder ? null : lis(srcIdx);
					let ref = anchor;
					for (let i = n - 1; i >= 0; i--) {
						let r = newRows[i];
						if (!r) {
							const key = keys ? keys[i] : i;
							r = newRows[i] = createRow(items[i], key, kvs ? kvs[i] : i);
							rows.set(key, r);
							instMove(r.inst, parent, ref);
						} else if (stable && !stable[i]) instMove(r.inst, parent, ref);
						r.idx = i;
						ref = instFirst(r.inst);
					}
				}
				order = newRows;
				if (refresh) {
					const list = [];
					refresh.forEach((r) => collectAll(r.inst.block, list));
					runEffects(list);
				}
			});
			if (stats) stats.list += performance.now() - t0;
		});
	}
	function bindSlot(op, anchor, view, data, block) {
		const slot = view.__slot;
		let inst = null;
		if (op.path.length === 1) anchor.__dyn = { nodes: () => inst ? instNodes(inst).concat(anchor) : [anchor] };
		untrack(() => {
			if (slot && slot.plan) {
				let sd = slot.data;
				const keys = Object.keys(op.props);
				if (keys.length) {
					sd = Object.create(slot.data);
					keys.forEach((k) => {
						const exp = op.props[k];
						Object.defineProperty(sd, k, {
							get: () => ev(view, exp, data, op),
							enumerable: true,
							configurable: true
						});
					});
				}
				inst = instantiate(slot.plan, slot.view, sd, slot.block, { static: slot.static });
				block.onDispose(() => inst.block.dispose());
			} else if (op.fallback) inst = instantiate(op.fallback, view, data, block);
			if (inst) instMove(inst, anchor.parentNode, anchor);
		});
	}
	function bindComp(op, host, view, data, block) {
		if (op.name === "w-static") {
			if (op.slotPlan) instMove(untrack(() => instantiate(op.slotPlan, view, data, block, { static: true })), host, null);
			return;
		}
		const entry = view.__component(op.name);
		if (!entry) return;
		if (entry.legacy) return untrack(() => OPS.legacyComp(entry.legacy, op, host, view, data, block));
		const start = (proto) => {
			if (!block.disposed) untrack(() => mountComponent(proto, op, host, view, data, block));
		};
		if (entry.remote) {
			const r = entry.remote;
			r.load();
			if (r.view) start(r.view);
			else {
				const w = () => start(r.view);
				r.waiters.add(w);
				block.onDispose(() => r.waiters.delete(w));
			}
		} else start(entry.view);
	}
	function mountComponent(proto, op, host, view, data, block) {
		const parentPath = view.__path || ["root"];
		if (parentPath.length > config.maxDepth) {
			report(`Превышена глубина вложенности компонентов (${config.maxDepth}), «${op.name}» не создан`, {
				level: "error",
				view,
				hint: "Рекурсивный компонент без условия выхода: остановите рекурсию через w-if."
			});
			host.setAttribute("data-wex-error", "max-depth");
			return null;
		}
		const comp = proto.clone();
		comp.__path = parentPath.concat(op.name);
		comp.__parent = view;
		const outside = {};
		comp.__outside = outside;
		let mounted = false;
		for (const attr in op.attrs) {
			const exp = op.attrs[attr];
			const c = attr.charCodeAt(0);
			if (c === 58) {
				const key = camelCase(attr.slice(1));
				effect(block, () => {
					const v = ev(view, exp, data, { attr });
					if (isNone(v)) report(`Проп «${attr.slice(1)}» компонента «${op.name}» получил ${v}`, {
						view,
						attr,
						expr: exp
					});
					if (!mounted) outside[key] = v;
					else comp.__setProp(key, v);
				});
			} else if (c === 64) {
				const event = camelCase(attr.slice(1));
				const [fname, params] = parseKey(exp);
				outside["@" + event] = function(...args) {
					const fn = view.fn(fname);
					if (!fn) return;
					const st = view.state;
					const res = params ? fn.call(view, st, ...params.map((p) => ev(view, p, data))) : fn.call(view, st);
					if (isFunction(res)) return res.apply(this, args);
				};
			} else if (attr[0] !== "_") outside[camelCase(attr)] = exp;
		}
		comp.__slot = op.slotPlan ? {
			plan: op.slotPlan,
			view,
			data,
			block
		} : null;
		let target = host;
		if (proto.tag !== "template") {
			const doc = host.ownerDocument;
			target = doc.createElement(proto.tag);
			const attrs = Object.assign({}, getNodeAttrs(host), proto.attributes, { "data-hoist": op.name });
			Object.keys(attrs).forEach((k) => {
				try {
					target.setAttribute(k, attrs[k]);
				} catch (e) {}
			});
			const begin = doc.createComment(` ${op.name} begin `);
			const end = doc.createComment(` ${op.name} end `);
			host.replaceWith(begin, target, end);
			host.__dyn = { nodes: () => [
				begin,
				target,
				end
			] };
		}
		comp.mount(target);
		mounted = true;
		block.onDispose(() => comp.destroy());
		return comp;
	}
	const NON_BUBBLING = [
		"focus",
		"blur",
		"mouseenter",
		"mouseleave",
		"pointerenter",
		"pointerleave",
		"scroll",
		"load",
		"error",
		"toggle"
	];
	const nativeImport = new Function("u", "return import(u)");
	const remoteCache = {};
	function startLoad(entry, url) {
		if (entry.started) return entry;
		entry.started = true;
		const fetchText = async (tries = 3) => {
			for (let i = 0;; i++) try {
				const r = await fetch(url);
				if (!r.ok) throw new Error(`Wex: cannot load component ${url} (${r.status})`);
				return await r.text();
			} catch (e) {
				if (i >= tries - 1) throw e;
				await new Promise((res) => setTimeout(res, 300 * 2 ** i));
			}
		};
		fetchText().then(async (html) => {
			const doc = new DOMParser().parseFromString(html, "text/html");
			const tpl = doc.querySelector("template");
			if (!tpl) throw new Error(`Wex: no <template> in ${url}`);
			const inner = tpl.innerHTML;
			const T = {
				state: (init) => createView(inner, init),
				vm: () => createView(inner, () => ({}), null, null, true)
			};
			const code = doc.querySelector("script[type=\"module\"]")?.textContent;
			let v;
			if (code) {
				const blobUrl = URL.createObjectURL(new Blob([code], { type: "text/javascript" }));
				try {
					v = (await nativeImport(blobUrl)).default(T);
				} finally {
					URL.revokeObjectURL(blobUrl);
				}
			} else v = T.vm();
			if (!(v instanceof View)) throw new Error(`Wex: ${url} must export default a function returning a view`);
			entry.view = v;
			const ws = [...entry.waiters];
			entry.waiters.clear();
			ws.forEach((w) => {
				try {
					w();
				} catch (e) {
					console.error(e);
				}
			});
		}).catch((e) => {
			entry.started = false;
			console.error(e);
		});
		return entry;
	}
	function loadRemote(url, { lazy = false } = {}) {
		let entry = remoteCache[url];
		if (!entry) entry = remoteCache[url] = {
			view: null,
			waiters: /* @__PURE__ */ new Set(),
			started: false,
			load: () => startLoad(entry, url)
		};
		if (!lazy) entry.load();
		return entry;
	}
	function preloadComponent(url) {
		return loadRemote(url);
	}
	let viewSeq = 0;
	function cloneState(value) {
		if (Array.isArray(value)) return value.map(cloneState);
		if (value && typeof value === "object" && (Object.getPrototypeOf(value) === Object.prototype || Object.getPrototypeOf(Object.getPrototypeOf(value) || {}) === null)) {
			const out = {};
			Object.keys(value).forEach((k) => {
				out[k] = cloneState(value[k]);
			});
			return out;
		}
		return value;
	}
	function createView(html, initState = {}, tplEl = null, attrsExpr = null, open = false) {
		const id = tplEl && (tplEl.id || tplEl.getAttribute("w-id")) || "v" + ++viewSeq;
		const view = new View();
		const components = /* @__PURE__ */ new Map();
		const directives = new Map(globalDirectives);
		const ownFilters = {};
		let scope = globalScope;
		let sigCache = null;
		let envCache = null;
		let state = null;
		let outside = null;
		let root = null;
		let rootInst = null;
		let isMounted = false;
		let isUnmounted = false;
		const fns = {};
		const handlers = [];
		const actions = [];
		let unsubscribe = null;
		const delegated = /* @__PURE__ */ new Map();
		let held = 0;
		const skipped = /* @__PURE__ */ new Set();
		let changePending = false;
		let lastInfo = null;
		let prevented = false;
		let gateId = -1;
		let gateOpen = true;
		let envVer = globalVer;
		const invalidate = () => {
			sigCache = null;
			envCache = null;
			envVer = globalVer;
		};
		const tick = {};
		const hasListeners = (event) => handlers.some((h) => h.event === event) || !!($ && tplEl && $._data(tplEl, "events") && $._data(tplEl, "events")[event]);
		function emit(event, ...args) {
			if (event[0] !== "$") {
				if (outside) {
					const lower = ("@" + event).toLowerCase();
					const key = "@" + event in outside ? "@" + event : Object.keys(outside).find((k) => k.toLowerCase() === lower);
					if (key && isFunction(outside[key])) outside[key](...args);
				}
				return;
			}
			handlers.slice().forEach((h) => {
				if (h.event !== event) return;
				if (h.once) handlers.splice(handlers.indexOf(h), 1);
				h.fn.call(view, state, ...args);
			});
			if ($ && tplEl) {
				const evs = $._data(tplEl, "events");
				if (evs && evs[event]) $(tplEl).triggerHandler(event, args);
			}
		}
		const wrapEvent = (e) => $ && $.event && $.event.fix ? $.event.fix(e) : e;
		function attach(a) {
			if (!root || a.listener) return;
			const direct = NON_BUBBLING.indexOf(a.event) !== -1;
			a.listener = function(e) {
				let target = root;
				if (a.selector) {
					target = e.target.closest ? e.target.closest(a.selector) : null;
					if (!target || !root.contains(target)) return;
				}
				const cb = a.fn.call(view, state);
				let res;
				if (isFunction(cb)) res = cb.call(target, wrapEvent(e));
				if (res === false) {
					e.preventDefault();
					e.stopPropagation();
				}
				if (a.once) view.off(a.event, a.selector, a.fn);
				return res;
			};
			root.addEventListener(a.event, a.listener, direct);
			a.capture = direct;
		}
		function detach(a) {
			if (root && a.listener) root.removeEventListener(a.event, a.listener, a.capture);
			a.listener = null;
		}
		function bindArgs(args, once) {
			const info = [...args];
			const fn = info.pop();
			const [event, selector] = info;
			if (event[0] === "$") {
				handlers.push({
					event,
					fn,
					once
				});
				if (event === "$change") ensureSubscribed();
			} else {
				const a = {
					event,
					selector,
					fn,
					once,
					listener: null
				};
				actions.push(a);
				if (isMounted) attach(a);
			}
			return view;
		}
		function delegate(event) {
			if (delegated.has(event) || !root) return;
			const direct = NON_BUBBLING.indexOf(event) !== -1;
			const r = root;
			const listener = (e) => {
				let je = null;
				for (let el = e.target; el && el !== r; el = el.parentNode) {
					if (direct && el !== e.target) break;
					const h = el.__wOn && el.__wOn[event];
					if (!h || h.view !== view) continue;
					const fn = view.fn(h.fname);
					if (!fn) continue;
					if (!je) {
						je = wrapEvent(e);
						if (je !== e) je.delegateTarget = r;
					}
					if (je !== e) je.currentTarget = el;
					const res = h.params ? fn.call(view, state, ...h.params.map((p) => ev(view, p, h.data))) : fn.call(view, state);
					if ((isFunction(res) ? res.call(el, je) : res) === false) {
						je.preventDefault();
						je.stopPropagation();
					}
					if (je !== e ? je.isPropagationStopped() : e.cancelBubble) break;
				}
			};
			r.addEventListener(event, listener, direct);
			delegated.set(event, {
				listener,
				direct,
				root: r
			});
		}
		function assignProps(obj) {
			const lower = {};
			Object.keys(state).forEach((k) => {
				lower[k.toLowerCase()] = k;
			});
			for (const key in obj) if (key[0] !== "@") setProp(key, obj[key], lower);
		}
		function setProp(key, value, lower) {
			if (!lower) {
				lower = {};
				Object.keys(state).forEach((k) => {
					lower[k.toLowerCase()] = k;
				});
			}
			let real = key in state ? key : lower[key.toLowerCase()];
			if (!real) {
				if (!open) return;
				real = key;
			}
			const prev = toRaw(state[real]);
			const next = toRaw(value);
			if (prev === next) return;
			if (!isReactive(value) && isEqual(prev, next)) return;
			state[real] = next;
		}
		function init() {
			const next = isFunction(initState) ? initState.call(view) : initState;
			if (!next || typeof next !== "object") throw new Error("initState should must be an object");
			state = reactive(next);
			if (outside) assignProps(outside);
			if (state.storage) ensureSubscribed();
			emit("$init");
		}
		function ensureSubscribed() {
			if (unsubscribe || !state) return;
			unsubscribe = subscribe(state, (info) => {
				trigger(tick, "v", "set");
				lastInfo = info;
				if (changePending) return;
				changePending = true;
				Promise.resolve().then(flushChange);
			});
		}
		function flushChange() {
			if (!changePending) return;
			changePending = false;
			if (!state) return;
			let flag = true;
			emit("$change", state, lastInfo, () => {
				flag = false;
			});
			if (flag) VMLocalStorage.reloadJqvmLocalStorage(state, "$change");
			else prevented = true;
		}
		function shouldUpdate() {
			if (!hasListeners("$update")) return true;
			let flag = true;
			emit("$update", state, () => {
				flag = false;
			});
			return flag;
		}
		view.__gate = (flushId) => {
			if (gateId === flushId) return gateOpen;
			gateId = flushId;
			let open = held === 0;
			if (open) {
				flushChange();
				open = !prevented;
				prevented = false;
				if (open) open = shouldUpdate();
			}
			return gateOpen = open;
		};
		view.skipped = skipped;
		function render() {
			rootInst = instantiate(getPlan(html, view), view, state, null);
			root.textContent = "";
			instMove(rootInst, root, null);
			if (attrsExpr) effect(rootInst.block, () => {
				const props = ev(view, attrsExpr, state) || {};
				for (const key in props) {
					const value = props[key];
					if (key === "class") String(value).split(" ").filter(Boolean).forEach((c) => root.classList.add(c));
					else if (key === "style") {
						if (isObject(value)) Object.assign(root.style, value);
						else if (isString(value)) root.setAttribute("style", value);
					} else root.setAttribute(key, value);
				}
			});
			emit("$render");
		}
		function mount(el) {
			if (el && el.jquery) el = el[0];
			if (isMounted) {
				if (!el || el === root) return view;
				view.unmount();
			}
			if (!el && tplEl && tplEl.nextElementSibling && tplEl.nextElementSibling.getAttribute("w-name") === id) return view;
			if (!isUnmounted) init();
			let target = typeof el === "string" ? document.querySelector(el) : el;
			if (!target) {
				if (tplEl && tplEl.parentNode) {
					target = document.createElement("div");
					tplEl.after(target);
				} else throw new Error("el should must be passed by view.mount");
			}
			root = target;
			root.setAttribute("w-name", id);
			postDepth++;
			try {
				render();
			} finally {
				postDepth--;
			}
			runPost();
			actions.forEach(attach);
			VMLocalStorage.reloadJqvmLocalStorage(state, "$mount");
			isMounted = true;
			isUnmounted = false;
			emit("$mount", state);
			return view;
		}
		function unmount() {
			if (!isMounted) return view;
			emit("$unmount");
			actions.forEach(detach);
			delegated.forEach(({ listener, direct, root: r }, event) => r.removeEventListener(event, listener, direct));
			delegated.clear();
			if (rootInst) rootInst.block.dispose();
			rootInst = null;
			skipped.clear();
			root.textContent = "";
			root.removeAttribute("w-name");
			root = null;
			isMounted = false;
			isUnmounted = true;
			return view;
		}
		function destroy() {
			emit("$beforeDestroy");
			unmount();
			if (unsubscribe) unsubscribe();
			unsubscribe = null;
			emit("$destroy");
			state = null;
			handlers.length = 0;
			actions.length = 0;
		}
		function forceUpdate() {
			if (!isMounted || !rootInst) return;
			const list = [];
			collectEffects(rootInst.block, view, list);
			skipped.forEach((e) => {
				if (list.indexOf(e) === -1) list.push(e);
			});
			skipped.clear();
			runEffects(list);
			runPost();
		}
		let forcePending = false;
		function scheduleForce() {
			if (forcePending) return;
			forcePending = true;
			Promise.resolve().then(() => {
				forcePending = false;
				forceUpdate();
			});
		}
		function update(next) {
			if (next === true) {
				forceUpdate();
				return view;
			}
			if (state && next) {
				if (isFunction(next)) {
					const m0 = mutationCount();
					const res = next(state);
					if (isObject(res)) Object.assign(state, res);
					else if (config.autoForce && mutationCount() === m0) scheduleForce();
				} else if (isObject(next)) Object.assign(state, next);
			}
			return view;
		}
		function hold() {
			held++;
			return view;
		}
		function release() {
			if (held > 0 && --held === 0) {
				flush();
				if (skipped.size) {
					const list = Array.from(skipped);
					skipped.clear();
					runEffects(list);
				}
				runPost();
			}
			return view;
		}
		function fn(name, action) {
			if (!action) return fns[name];
			fns[name] = action;
			return view;
		}
		function clone() {
			const nv = createView(html, isFunction(initState) ? initState : cloneState(initState), tplEl, attrsExpr, open);
			each(fns, (action, name) => nv.fn(name, action));
			handlers.forEach((h) => nv.__addHandler(h));
			actions.forEach((a) => nv.on(...[
				a.event,
				a.selector,
				a.fn
			].filter(Boolean)));
			components.forEach((entry, name) => nv.__setComponent(name, entry));
			directives.forEach((def, name) => {
				if (globalDirectives.get(name) !== def) nv.__setDirective(name, def);
			});
			Object.keys(ownFilters).forEach((k) => nv.filter(k, ownFilters[k]));
			handlers.forEach((h) => {
				if (h.event === "$clone") h.fn.call(view, state, nv);
			});
			return nv;
		}
		function each(obj, cb) {
			Object.keys(obj).forEach((k) => cb(obj[k], k));
		}
		Object.assign(view, {
			mount,
			unmount,
			destroy,
			update,
			hold,
			release,
			emit,
			clone,
			fn,
			method: fn,
			on(...a) {
				return bindArgs(a, false);
			},
			once(...a) {
				return bindArgs(a, true);
			},
			off(...args) {
				const info = [...args];
				const f = info.pop();
				const [event, selector] = info;
				if (event[0] === "$") {
					const i = handlers.findIndex((h) => h.event === event && h.fn === f);
					if (i > -1) handlers.splice(i, 1);
				} else {
					const i = actions.findIndex((a) => a.event === event && a.selector === selector && a.fn === f);
					if (i > -1) {
						detach(actions[i]);
						actions.splice(i, 1);
					}
				}
				return view;
			},
			find(sel) {
				if ($) return root ? $(root).find(sel) : $();
				return root ? Array.from(root.querySelectorAll(sel)) : [];
			},
			component(name, src, extra) {
				components.set(name.toLowerCase(), normComponent(name, src, extra));
				invalidate();
				if (src instanceof View && src !== view) view.on("$beforeDestroy", () => src.destroy());
				return view;
			},
			directive(name, compile, affect) {
				directives.set(name, normDirective(compile, affect));
				invalidate();
				return view;
			},
			filter(name, f) {
				ownFilters[name] = f;
				scope = new import_ScopeX.ScopeX({}, { filters: Object.assign({}, globalScope.filters, ownFilters) });
				return view;
			},
			plugin(f) {
				const life = f.call({
					view,
					get state() {
						return state;
					}
				});
				if (life) Object.keys(life).forEach((ev2) => view.on(ev2, life[ev2]));
				return view;
			},
			__scope: () => scope,
			__component: (name) => components.get(name) || view.__parent && view.__parent.__component(name) || globalComponents.get(name),
			__comps: () => components,
			__setComponent(name, entry) {
				components.set(name, entry);
				invalidate();
			},
			__directive: (name) => directives.get(name),
			__tick: tick,
			__subscribe: ensureSubscribed,
			__setDirective(name, def) {
				directives.set(name, def);
				invalidate();
			},
			__addHandler(h) {
				handlers.push({ ...h });
			},
			__delegate: delegate,
			__setProp(key, value) {
				if (!state) {
					outside = outside || {};
					outside[key] = value;
				} else setProp(key, value);
			},
			__sig() {
				if (envVer !== globalVer) invalidate();
				if (sigCache === null) sigCache = Array.from(view.__env().comps.keys()).sort().join() + "|" + Array.from(directives.keys()).sort().join();
				return sigCache;
			},
			__env() {
				if (envVer !== globalVer) invalidate();
				if (!envCache) {
					const comps = new Map(globalComponents);
					const chain = [];
					for (let v = view; v; v = v.__parent) chain.unshift(v);
					chain.forEach((v) => v.__comps().forEach((e, k) => comps.set(k, e)));
					envCache = {
						comps,
						dirs: new Map(directives)
					};
				}
				return envCache;
			}
		});
		Object.defineProperties(view, {
			state: { get: () => state },
			root: { get: () => root },
			__state: { get: () => state },
			__root: { get: () => root },
			tag: { value: tplEl ? tplEl.localName : "template" },
			attributes: { value: tplEl ? getNodeAttrs(tplEl) : {} },
			__outside: {
				get: () => outside,
				set: (v) => {
					outside = v;
				}
			},
			__slot: {
				value: null,
				writable: true
			},
			__path: {
				value: null,
				writable: true
			},
			__parent: {
				value: null,
				writable: true
			}
		});
		return view;
	}
	function view(source, initState, opts = {}) {
		let el = null;
		let html = source;
		if (typeof source !== "string") {
			el = source;
			html = el.innerHTML;
		} else if (source.indexOf("<") === -1 && source.indexOf("{{") === -1) {
			el = document.querySelector(source);
			if (!el) throw new Error(`Wex: template ${source} not found`);
			html = el.innerHTML;
		}
		const attrsExpr = opts.attrs || el && el.getAttribute && el.getAttribute("attrs") || null;
		return createView(html, initState, el, attrsExpr);
	}

// src/plugins/editor/wex-doc.js
	const wexView$1 = view || window.Wex && window.Wex.view;
	const component$1 = component$2;
	const { directive: directive$1 } = wex_exports;
	const FORMATS = [
		"bold",
		"italic",
		"underline",
		"strikethrough",
		"code",
		"subscript",
		"superscript"
	];
	const FORMAT_TAG = {
		bold: "strong",
		italic: "em",
		underline: "u",
		strikethrough: "s",
		code: "code",
		subscript: "sub",
		superscript: "sup"
	};
	const ALIGNS$1 = [
		"left",
		"center",
		"right",
		"justify"
	];
	const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		"\"": "&quot;",
		"'": "&#39;"
	})[c]);
	function safeUrl(url) {
		const u = String(url == null ? "" : url).trim();
		const probe = u.replace(/[\u0000-\u0020\u007f-\u009f]/g, "");
		if (!probe) return null;
		if (/^[a-z][a-z0-9+.\-]*:/i.test(probe)) return /^(https?|mailto|tel):/i.test(probe) ? probe : null;
		return u.replace(/[\u0000-\u001f\u007f-\u009f]/g, "");
	}
	const CLASS_RE = /^[\w\-:\/\[\].%#!(),]+$/;
	const classOk = (c) => typeof c === "string" && CLASS_RE.test(c);
	const emptyDoc = () => ({ root: {
		type: "root",
		children: [{
			type: "paragraph",
			children: []
		}]
	} });
	const isDoc = (d) => !!(d && d.root && Array.isArray(d.root.children));
	const clone = (v) => JSON.parse(JSON.stringify(v));
	const stable = (v) => JSON.stringify(v == null ? null : v, (k, x) => x && typeof x === "object" && !Array.isArray(x) ? Object.keys(x).sort().reduce((o, key) => (o[key] = x[key], o), {}) : x);
	function addStyle(id, css) {
		if (typeof document === "undefined" || document.getElementById(id)) return;
		const s = document.createElement("style");
		s.id = id;
		const nonce = window.Quas && window.Quas.CSSNonce;
		if (nonce) s.nonce = nonce;
		s.textContent = css;
		document.head.appendChild(s);
	}
	const NODES = {};
	function registerNode(type, fn) {
		NODES[type] = fn;
	}
	function renderNode(node, ctx) {
		const fn = node && NODES[node.type];
		return fn ? fn(node, ctx || {}) : "";
	}
	const renderNodes = (nodes, ctx) => (Array.isArray(nodes) ? nodes : []).map((n) => renderNode(n, ctx)).join("");
	const renderChildren = (node, ctx) => renderNodes(node.children, ctx);
	const classAttr = (meta) => {
		const list = meta && Array.isArray(meta.classes) ? meta.classes.filter(classOk) : [];
		return list.length ? ` class="${esc(list.join(" "))}"` : "";
	};
	const alignAttr = (a) => ALIGNS$1.includes(a) ? ` style="text-align:${a}"` : "";
	registerNode("root", (n, ctx) => renderChildren(n, ctx));
	registerNode("paragraph", (n, ctx) => `<p${classAttr(n.meta)}${alignAttr(n.align)}>${renderChildren(n, ctx) || "<br>"}</p>`);
	registerNode("heading", (n, ctx) => {
		const tag = /^h[1-6]$/.test(n.tag) ? n.tag : "h2";
		return `<${tag}${classAttr(n.meta)}${alignAttr(n.align)}>${renderChildren(n, ctx) || "<br>"}</${tag}>`;
	});
	registerNode("text", (n) => {
		let html = esc(n.text == null ? "" : n.text);
		const format = Array.isArray(n.format) ? n.format : [];
		for (const f of FORMATS) if (format.includes(f)) html = `<${FORMAT_TAG[f]}>${html}</${FORMAT_TAG[f]}>`;
		return html;
	});
	registerNode("linebreak", () => "<br>");
	registerNode("link", (n, ctx) => {
		const url = safeUrl(n.url);
		const inner = renderChildren(n, ctx);
		return url ? `<a href="${esc(url)}" rel="noopener noreferrer"${classAttr(n.meta)}>${inner}</a>` : inner;
	});
	function renderDoc(doc) {
		return isDoc(doc) ? renderNode(doc.root, {}) : "";
	}
	addStyle("wxe-doc", `
:where(.wxe-doc){line-height:1.7}
:where(.wxe-doc) h1{font-size:2rem;line-height:1.2;font-weight:700;margin:1.2em 0 .5em}
:where(.wxe-doc) h2{font-size:1.5rem;line-height:1.3;font-weight:700;margin:1.1em 0 .5em}
:where(.wxe-doc) h3{font-size:1.25rem;line-height:1.4;font-weight:600;margin:1em 0 .4em}
:where(.wxe-doc) h4,:where(.wxe-doc) h5,:where(.wxe-doc) h6{font-weight:600;margin:1em 0 .4em}
:where(.wxe-doc) p{margin:.75em 0}
:where(.wxe-doc) a{color:#2563eb;text-decoration:underline}
html.dark :where(.wxe-doc) a{color:#60a5fa}
:where(.wxe-doc) code{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:.9em;padding:.1em .35em;border-radius:4px;background:rgba(127,127,127,.18)}
:where(.wxe-doc)>:first-child{margin-top:0}
:where(.wxe-doc)>:last-child{margin-bottom:0}
`);
	function paint(v, state) {
		const el = v.root;
		if (!el) return;
		el.classList.add("wxe-doc");
		const key = stable(state.doc);
		if (el.__wdocKey !== key) {
			el.__wdocKey = key;
			el.innerHTML = renderDoc(state.doc);
		}
	}
	function createDocView() {
		return wexView$1("<!---->", () => ({ doc: null })).on("$init", function() {
			this.__subscribe();
		}).on("$mount", function(state) {
			paint(this, state);
		}).on("$change", function(state) {
			paint(this, state);
		});
	}
	function registerDoc(name = "wex-doc") {
		component$1(name, createDocView());
	}
	registerDoc();
	if (typeof window !== "undefined") window.WexDoc = {
		renderDoc,
		registerNode,
		renderNode,
		renderNodes,
		safeUrl,
		esc
	};

// src/plugins/editor/wex-editor.js
	const wexView = view || window.Wex && window.Wex.view;
	const component = component$2;
	const { directive } = wex_exports;
	const BLOCK = new Set("P DIV H1 H2 H3 H4 H5 H6 LI UL OL BLOCKQUOTE PRE SECTION ARTICLE HEADER FOOTER ASIDE NAV MAIN FIGURE FIGCAPTION TABLE THEAD TBODY TR TD TH DL DT DD HR".split(" "));
	const SKIP = new Set("SCRIPT STYLE IFRAME OBJECT EMBED NOSCRIPT TEMPLATE SVG CANVAS AUDIO VIDEO HEAD META LINK TITLE IMG FORM INPUT BUTTON SELECT TEXTAREA".split(" "));
	const FMT_TAGS = {
		B: "bold",
		STRONG: "bold",
		I: "italic",
		EM: "italic",
		U: "underline",
		S: "strikethrough",
		STRIKE: "strikethrough",
		DEL: "strikethrough",
		CODE: "code",
		SUB: "subscript",
		SUP: "superscript"
	};
	const ALIGNS = [
		"left",
		"center",
		"right",
		"justify"
	];
	const tag = (n) => n.tagName.toUpperCase();
	function pushText(out, text, fmt) {
		const format = FORMATS.filter((f) => fmt.includes(f));
		const last = out[out.length - 1];
		if (last && last.type === "text" && last.format.join() === format.join()) last.text += text;
		else out.push({
			type: "text",
			text,
			format
		});
	}
	function styleFormats(n, fmt) {
		let f = fmt;
		const add = (x) => {
			if (!f.includes(x)) f = f.concat(x);
		};
		const st = n.style;
		if (st) {
			if (/^(bold|[6-9]00)$/.test(st.fontWeight)) add("bold");
			if (st.fontStyle === "italic") add("italic");
			const td = st.textDecoration || st.textDecorationLine || "";
			if (td.includes("underline")) add("underline");
			if (td.includes("line-through")) add("strikethrough");
		}
		return f;
	}
	function inline(n, fmt, out) {
		if (n.nodeType === 3) {
			const t = n.nodeValue.replace(/[ \t\r\n\f]+/g, " ");
			if (t) pushText(out, t, fmt);
			return;
		}
		if (n.nodeType !== 1) return;
		const t = tag(n);
		if (SKIP.has(t)) return;
		if (t === "BR") {
			out.push({ type: "linebreak" });
			return;
		}
		if (t === "A") {
			const url = safeUrl(n.getAttribute("href"));
			const kids = [];
			for (const c of n.childNodes) inline(c, fmt, kids);
			if (url && kids.length) out.push({
				type: "link",
				url,
				children: kids
			});
			else out.push(...kids);
			return;
		}
		const f = styleFormats(n, FMT_TAGS[t] ? fmt.concat(FMT_TAGS[t]) : fmt);
		for (const c of n.childNodes) inline(c, f, out);
	}
	function trimEdges(out) {
		const first = out[0];
		const last = out[out.length - 1];
		if (first && first.type === "text") first.text = first.text.replace(/^ +/, "");
		if (last && last.type === "text") last.text = last.text.replace(/ +$/, "");
		return out.filter((n) => n.type !== "text" || n.text);
	}
	function inlineKids(el) {
		const out = [];
		const f = styleFormats(el, []);
		for (const c of el.childNodes) inline(c, f, out);
		const last = out[out.length - 1];
		if (last && last.type === "linebreak") out.pop();
		return trimEdges(out);
	}
	function alignOf(el) {
		const a = String(el.style && el.style.textAlign || el.getAttribute("align") || "").toLowerCase();
		return ALIGNS.includes(a) ? a : void 0;
	}
	function mk(type, el, children, keep, extra) {
		const n = Object.assign({ type }, extra);
		const a = alignOf(el);
		if (a) n.align = a;
		if (keep) {
			const classes = [...el.classList].filter(classOk);
			if (classes.length) n.meta = { classes };
		}
		n.children = children;
		return n;
	}
	const hasBlockChild = (el) => [...el.children].some((c) => BLOCK.has(tag(c)));
	function parseBlocks(parent, out, keep) {
		let run = [];
		const flush = () => {
			const kids = trimEdges(run);
			run = [];
			if (kids.length) out.push({
				type: "paragraph",
				children: kids
			});
		};
		for (const n of parent.childNodes) {
			const t = n.nodeType === 1 ? tag(n) : "";
			if (n.nodeType === 3 || n.nodeType === 1 && !BLOCK.has(t) && !SKIP.has(t)) {
				inline(n, [], run);
				continue;
			}
			if (n.nodeType !== 1 || SKIP.has(t)) continue;
			flush();
			if (t === "HR") continue;
			if (/^H[1-6]$/.test(t)) out.push(mk("heading", n, inlineKids(n), keep, { tag: t.toLowerCase() }));
			else if (hasBlockChild(n)) parseBlocks(n, out, keep);
			else out.push(mk("paragraph", n, inlineKids(n), keep));
		}
		flush();
	}
	function htmlToDoc(html) {
		const body = new DOMParser().parseFromString(String(html), "text/html").body;
		const out = [];
		parseBlocks(body, out, false);
		if (!out.length) out.push({
			type: "paragraph",
			children: []
		});
		return { root: {
			type: "root",
			children: out
		} };
	}
	const svg = (inner) => `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
	const glyph = (t, style = "") => `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><text x="12" y="17" text-anchor="middle" font-size="18" font-weight="700" fill="currentColor" style="${style}">${t}</text></svg>`;
	const DEFAULTS = {
		toolbar: [
			"undo",
			"redo",
			"|",
			"h1",
			"h2",
			"p",
			"|",
			"bold",
			"italic",
			"underline",
			"strike",
			"|",
			"left",
			"center",
			"right",
			"|",
			"link"
		],
		placeholder: "Начните писать…",
		modules: [],
		doc: null,
		onChange: null,
		debounce: 0
	};
	const el = (cls, name) => {
		const e = document.createElement(name || "div");
		e.className = cls;
		return e;
	};
	const MAC = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent || "");
	const hotkeyLabel = (hk) => hk.split("+").map((p) => p === "mod" ? MAC ? "⌘" : "Ctrl" : p === "alt" ? MAC ? "⌥" : "Alt" : p === "shift" ? MAC ? "⇧" : "Shift" : p.toUpperCase()).join(MAC ? "" : "+");
	let customCount = 0;
	var Editor = class Editor {
		constructor(host, options = {}) {
			this.host = host;
			this.options = Object.assign({}, DEFAULTS, options);
			this.events = {};
			this.items = [];
			this.buttons = /* @__PURE__ */ new Map();
			this.listeners = [];
			this.modules = [];
			this.key = "";
			this._range = null;
			this._build();
			this.setDoc(this.options.doc);
			this.modules = this.options.modules.map((M) => new M(this));
		}
		_build() {
			addStyle("wxe-ui", UI_CSS);
			const o = this.options;
			const hints = o.modules.includes(HotKeys);
			this.root = el("wxe");
			this.bar = el("wxe-bar");
			this.bar.setAttribute("role", "toolbar");
			this.body = el("wxe-body wxe-doc");
			this.body.contentEditable = "true";
			this.body.setAttribute("role", "textbox");
			this.body.setAttribute("aria-multiline", "true");
			this.body.setAttribute("data-placeholder", o.placeholder);
			this.root.append(this.bar, this.body);
			this.host.appendChild(this.root);
			for (const entry of o.toolbar) {
				if (entry === "|") {
					this.bar.appendChild(el("wxe-sep"));
					continue;
				}
				const def = typeof entry === "string" ? Editor.items[entry] : Object.assign({ name: "custom-" + ++customCount }, entry);
				if (!def) {
					console.warn("[WexEditor] неизвестный пункт тулбара: " + entry);
					continue;
				}
				const btn = el("wxe-btn", "button");
				btn.type = "button";
				btn.title = def.title + (hints && def.hotkey ? ` (${hotkeyLabel(def.hotkey)})` : "");
				btn.setAttribute("aria-label", def.title || def.name);
				btn.innerHTML = def.icon || esc(def.label || def.name);
				btn.addEventListener("mousedown", (e) => e.preventDefault());
				btn.addEventListener("click", () => this.run(def));
				this.bar.appendChild(btn);
				this.items.push(def);
				this.buttons.set(def, btn);
			}
			try {
				document.execCommand("defaultParagraphSeparator", false, "p");
			} catch (e) {}
			this._on(this.body, "input", () => {
				this._normalize();
				this._schedule();
			});
			this._on(this.body, "blur", () => this.sync());
			this._on(this.body, "paste", (e) => this._paste(e));
			this._on(document, "selectionchange", () => this._selection());
		}
		_on(target, type, fn) {
			target.addEventListener(type, fn);
			this.listeners.push([
				target,
				type,
				fn
			]);
		}
		on(name, fn) {
			(this.events[name] = this.events[name] || []).push(fn);
			return this;
		}
		off(name, fn) {
			this.events[name] = (this.events[name] || []).filter((f) => f !== fn);
			return this;
		}
		emit(name, ...args) {
			(this.events[name] || []).slice().forEach((fn) => fn(...args));
		}
		getDoc() {
			const out = [];
			parseBlocks(this.body, out, true);
			if (!out.length) out.push({
				type: "paragraph",
				children: []
			});
			return { root: {
				type: "root",
				children: out
			} };
		}
		setDoc(doc) {
			this.body.innerHTML = renderDoc(isDoc(doc) ? doc : emptyDoc());
			if (!this.body.firstChild) this.body.innerHTML = "<p><br></p>";
			this._empty();
			this.key = stable(this.getDoc());
			return this;
		}
		sync() {
			this._cancel();
			if (this.destroyed) return;
			const doc = this.getDoc();
			const key = stable(doc);
			if (key === this.key) return;
			this.key = key;
			this.emit("change", doc);
			if (this.options.onChange) this.options.onChange(doc);
		}
		_schedule() {
			this._cancel();
			const ms = Number(this.options.debounce) || 0;
			if (ms > 0) this._t = setTimeout(() => this.sync(), ms);
			else this._raf = requestAnimationFrame(() => this.sync());
		}
		_cancel() {
			clearTimeout(this._t);
			cancelAnimationFrame(this._raf);
		}
		_empty() {
			this.body.toggleAttribute("data-empty", !this.body.textContent && this.body.children.length <= 1);
		}
		_normalize() {
			const b = this.body;
			if (!b.firstChild) {
				b.innerHTML = "<p><br></p>";
				this._caret(b.firstChild);
			} else if (b.firstChild.nodeType === 3) document.execCommand("formatBlock", false, "<p>");
			this._empty();
		}
		_paste(e) {
			const cd = e.clipboardData;
			if (!cd) return;
			e.preventDefault();
			const html = cd.getData("text/html");
			if (html) {
				const blocks = htmlToDoc(html).root.children;
				const out = blocks.length === 1 ? renderNodes(blocks[0].children) : renderNodes(blocks);
				if (out) {
					document.execCommand("insertHTML", false, out);
					this.sync();
					return;
				}
			}
			const text = cd.getData("text/plain");
			if (text) {
				document.execCommand("insertText", false, text);
				this.sync();
			}
		}
		_sel() {
			const s = window.getSelection();
			return s && s.rangeCount && this.body.contains(s.anchorNode) ? s : null;
		}
		_selection() {
			if (!this.root.isConnected) {
				if (this._wasConnected) this.destroy();
				return;
			}
			this._wasConnected = true;
			if (this._sel()) this.updateToolbar();
		}
		_caret(node) {
			const r = document.createRange();
			r.selectNodeContents(node);
			r.collapse(true);
			const s = window.getSelection();
			s.removeAllRanges();
			s.addRange(r);
		}
		saveRange() {
			const s = this._sel();
			this._range = s ? s.getRangeAt(0).cloneRange() : null;
		}
		restoreRange() {
			if (!this._range) return;
			const s = window.getSelection();
			s.removeAllRanges();
			s.addRange(this._range);
		}
		blockEl() {
			const s = this._sel();
			let n = s && s.anchorNode;
			while (n && n.parentNode !== this.body) n = n.parentNode;
			return n && n.nodeType === 1 ? n : null;
		}
		blockTag() {
			const b = this.blockEl();
			const t = b ? b.tagName.toLowerCase() : "p";
			return /^h[1-6]$/.test(t) ? t : "p";
		}
		alignment() {
			const b = this.blockEl();
			if (!b) return "left";
			const a = getComputedStyle(b).textAlign;
			return a === "start" ? "left" : a === "end" ? "right" : a === "-webkit-center" ? "center" : a;
		}
		closest(name) {
			const s = this._sel();
			let n = s && s.anchorNode;
			while (n && n !== this.body) {
				if (n.nodeType === 1 && n.tagName === name) return n;
				n = n.parentNode;
			}
			return null;
		}
		exec(cmd, val) {
			this.body.focus();
			document.execCommand(cmd, false, val);
		}
		setBlock(t) {
			this.exec("formatBlock", `<${t}>`);
		}
		run(def) {
			this.body.focus();
			if (def.run) def.run(this);
			this._empty();
			this.sync();
			this.updateToolbar();
		}
		updateToolbar() {
			this.buttons.forEach((btn, def) => {
				const on = def.isActive ? !!def.isActive(this) : false;
				btn.classList.toggle("is-active", on);
				btn.setAttribute("aria-pressed", on ? "true" : "false");
			});
		}
		destroy() {
			if (this.destroyed) return;
			this.destroyed = true;
			this._cancel();
			this.listeners.forEach(([t, type, fn]) => t.removeEventListener(type, fn));
			this.modules.forEach((m) => m.destroy && m.destroy());
			this.root.remove();
			this.emit("destroy");
		}
	};
	Editor.items = {};
	Editor.register = (name, def) => {
		Editor.items[name] = Object.assign({ name }, def);
	};
	const cmdItem = (name, cmd, title, icon, hotkey) => Editor.register(name, {
		title,
		icon,
		hotkey,
		isActive: () => document.queryCommandState(cmd),
		run: (ed) => ed.exec(cmd)
	});
	const blockItem = (name, t, title, icon, hotkey) => Editor.register(name, {
		title,
		icon,
		hotkey,
		isActive: (ed) => ed.blockTag() === t,
		run: (ed) => ed.setBlock(t !== "p" && ed.blockTag() === t ? "p" : t)
	});
	const ALIGN_ITEMS = {
		left: [
			"justifyLeft",
			"По левому краю",
			"M4 6h16M4 10h10M4 14h16M4 18h10",
			"mod+shift+l"
		],
		center: [
			"justifyCenter",
			"По центру",
			"M4 6h16M7 10h10M4 14h16M7 18h10",
			"mod+shift+e"
		],
		right: [
			"justifyRight",
			"По правому краю",
			"M4 6h16M10 10h10M4 14h16M10 18h10",
			"mod+shift+r"
		],
		justify: [
			"justifyFull",
			"По ширине",
			"M4 6h16M4 10h16M4 14h16M4 18h16",
			"mod+shift+j"
		]
	};
	Editor.register("undo", {
		title: "Отменить",
		hotkey: "mod+z",
		run: (ed) => ed.exec("undo"),
		icon: svg("<polyline points=\"1 4 1 10 7 10\"/><path d=\"M3.51 15a9 9 0 1 0 2.13-9.36L1 10\"/>")
	});
	Editor.register("redo", {
		title: "Повторить",
		hotkey: "mod+shift+z",
		run: (ed) => ed.exec("redo"),
		icon: svg("<polyline points=\"23 4 23 10 17 10\"/><path d=\"M20.49 15a9 9 0 1 1-2.12-9.36L23 10\"/>")
	});
	blockItem("h1", "h1", "Заголовок 1", glyph("H1", "font-size:18px"), "mod+alt+1");
	blockItem("h2", "h2", "Заголовок 2", glyph("H2", "font-size:18px"), "mod+alt+2");
	blockItem("p", "p", "Абзац", glyph("¶"), "mod+alt+0");
	cmdItem("bold", "bold", "Жирный", glyph("B"), "mod+b");
	cmdItem("italic", "italic", "Курсив", glyph("I", "font-style:italic;font-family:serif;font-weight:400"), "mod+i");
	cmdItem("underline", "underline", "Подчёркнутый", glyph("U", "text-decoration:underline;font-weight:400"), "mod+u");
	cmdItem("strike", "strikeThrough", "Зачёркнутый", glyph("S", "text-decoration:line-through;font-weight:400"), "mod+shift+x");
	Object.keys(ALIGN_ITEMS).forEach((name) => {
		const [cmd, title, path, hotkey] = ALIGN_ITEMS[name];
		Editor.register(name, {
			title,
			hotkey,
			icon: svg(`<path d="${path}"/>`),
			isActive: (ed) => ed.alignment() === name,
			run: (ed) => ed.exec(cmd)
		});
	});
	Editor.register("link", {
		title: "Ссылка",
		hotkey: "mod+k",
		icon: svg("<path d=\"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71\"/><path d=\"M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71\"/>"),
		isActive: (ed) => !!ed.closest("A"),
		run: (ed) => {
			if (ed.closest("A")) {
				ed.exec("unlink");
				return;
			}
			ed.saveRange();
			const url = safeUrl(window.prompt("Адрес ссылки", "https://"));
			if (!url || url === "https://") return;
			ed.restoreRange();
			const s = window.getSelection();
			if (s && s.isCollapsed) ed.exec("insertHTML", `<a href="${esc(url)}">${esc(url)}</a>`);
			else ed.exec("createLink", url);
		}
	});
	const normHotkey = (s) => {
		const p = String(s).toLowerCase().split("+");
		const key = p.pop();
		return [
			"mod",
			"alt",
			"shift"
		].filter((m) => p.includes(m)).concat(key).join("+");
	};
	const comboOf = (e) => {
		const key = /^(Key|Digit)/.test(e.code) ? e.code.slice(-1).toLowerCase() : String(e.key).toLowerCase();
		return [
			(e.ctrlKey || e.metaKey) && "mod",
			e.altKey && "alt",
			e.shiftKey && "shift",
			key
		].filter(Boolean).join("+");
	};
	var HotKeys = class {
		constructor(editor) {
			this.editor = editor;
			this.map = /* @__PURE__ */ new Map();
			editor.items.forEach((def) => {
				if (def.hotkey) this.map.set(normHotkey(def.hotkey), def);
			});
			this.handler = (e) => {
				const def = this.map.get(comboOf(e));
				if (!def) return;
				e.preventDefault();
				editor.run(def);
			};
			editor.body.addEventListener("keydown", this.handler);
		}
		destroy() {
			this.editor.body.removeEventListener("keydown", this.handler);
		}
	};
	function createEditorView(options = {}) {
		return wexView("<!---->", () => ({ doc: null })).on("$init", function() {
			this.__subscribe();
		}).on("$mount", function(state) {
			const doc = isDoc(state.doc) ? clone(state.doc) : emptyDoc();
			const ed = new Editor(this.root, Object.assign({}, options, { doc }));
			this.__ed = ed;
			ed.on("change", (next) => this.emit("change", next));
		}).on("$change", function(state) {
			const ed = this.__ed;
			if (!ed) return;
			const doc = isDoc(state.doc) ? clone(state.doc) : emptyDoc();
			if (stable(doc) !== ed.key) ed.setDoc(doc);
		}).on("$unmount", function() {
			if (this.__ed) {
				this.__ed.destroy();
				this.__ed = null;
			}
		});
	}
	function createEditor(options = {}, name = "wex-editor") {
		component(name, createEditorView(options));
		return function() {};
	}
	const UI_CSS = `
.wxe {
  --wxe-bg: #ffffff;
  --wxe-fg: #09090b;
  --wxe-muted-fg: #71717a;
  --wxe-placeholder: #a1a1aa;
  --wxe-border: #e4e4e7;
  --wxe-border-focus: #a1a1aa;
  --wxe-ring: rgba(24, 24, 27, 0.08);
  --wxe-bar: #fafafa;
  --wxe-hover: #f4f4f5;
  --wxe-active: #e4e4e7;
  --wxe-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);

  display: flex;
  flex-direction: column;
  border: 1px solid var(--wxe-border);
  border-radius: 0.5rem;
  background: var(--wxe-bg);
  color: var(--wxe-fg);
  box-shadow: var(--wxe-shadow);
  overflow: hidden;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

html.dark .wxe {
  --wxe-bg: #09090b;
  --wxe-fg: #fafafa;
  --wxe-muted-fg: #a1a1aa;
  --wxe-placeholder: #52525b;
  --wxe-border: #27272a;
  --wxe-border-focus: #52525b;
  --wxe-ring: rgba(250, 250, 250, 0.08);
  --wxe-bar: #121215;
  --wxe-hover: #27272a;
  --wxe-active: #3f3f46;
  --wxe-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.4);
}

/* Мягкий полупрозрачный focus-ring без резкой черноты */
.wxe:focus-within {
  border-color: var(--wxe-border-focus);
  box-shadow: 0 0 0 3px var(--wxe-ring), var(--wxe-shadow);
}

/* Тулбар */
.wxe-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 3px;
  padding: 6px;
  border-bottom: 1px solid var(--wxe-border);
  background: var(--wxe-bar);
}

/* Кнопки 32x32 с хорошо читаемыми иконками 18px */
.wxe-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  border-radius: 0.375rem;
  color: var(--wxe-muted-fg);
  background: transparent;
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease, transform 0.1s ease;
}

.wxe-btn svg {
  width: 18px;
  height: 18px;
  stroke-width: 2;
  flex-shrink: 0;
}

.wxe-btn:hover {
  background: var(--wxe-hover);
  color: var(--wxe-fg);
}

.wxe-btn:active {
  transform: scale(0.96);
}

.wxe-btn.is-active {
  background: var(--wxe-active);
  color: var(--wxe-fg);
}

.wxe-btn:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px var(--wxe-bg), 0 0 0 4px var(--wxe-border-focus);
}

.wxe-btn:disabled {
  opacity: 0.45;
  pointer-events: none;
}

/* Разделитель */
.wxe-sep {
  width: 1px;
  height: 18px;
  margin: 0 4px;
  background: var(--wxe-border);
  flex-shrink: 0;
}

/* Рабочая область редактора */
.wxe-body {
  position: relative;
  min-height: 12rem;
  padding: 14px 16px;
  font-size: 0.9375rem; /* 15px — комфортнее для чтения */
  line-height: 1.6;
  outline: none;
  word-break: break-word;
}

.wxe-body[data-empty]::before {
  content: attr(data-placeholder);
  position: absolute;
  top: 14px;
  left: 16px;
  color: var(--wxe-placeholder);
  pointer-events: none;
}

/* Типографика контента внутри редактора */
.wxe-body > *:first-child { margin-top: 0; }
.wxe-body > *:last-child { margin-bottom: 0; }
.wxe-body p { margin: 0.5rem 0; }
.wxe-body h1 { font-size: 1.5rem; font-weight: 700; letter-spacing: -0.025em; margin: 1rem 0 0.5rem; }
.wxe-body h2 { font-size: 1.25rem; font-weight: 600; letter-spacing: -0.025em; margin: 0.875rem 0 0.5rem; }
.wxe-body h3 { font-size: 1.125rem; font-weight: 600; letter-spacing: -0.02em; margin: 0.75rem 0 0.375rem; }
.wxe-body ul { list-style-type: disc; padding-left: 1.25rem; margin: 0.5rem 0; }
.wxe-body ol { list-style-type: decimal; padding-left: 1.25rem; margin: 0.5rem 0; }
.wxe-body blockquote {
  border-left: 2px solid var(--wxe-border);
  padding-left: 0.875rem;
  color: var(--wxe-muted-fg);
  font-style: italic;
  margin: 0.75rem 0;
}
.wxe-body code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.85em;
  background: var(--wxe-hover);
  padding: 0.15rem 0.35rem;
  border-radius: 0.25rem;
}
.wxe-body a {
  color: var(--wxe-fg);
  text-decoration: underline;
  text-underline-offset: 4px;
}
`;
	if (typeof window !== "undefined") window.WexEditor = {
		Editor,
		HotKeys,
		createEditor,
		htmlToDoc
	};

exports.Editor = Editor;
exports.HotKeys = HotKeys;
exports.createEditor = createEditor;
exports.createEditorView = createEditorView;
exports.htmlToDoc = htmlToDoc;
});