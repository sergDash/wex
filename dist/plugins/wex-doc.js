(function(global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ?  factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global.WexDoc = {})));
})(this, function(exports) {
Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
// \0rolldown/runtime.js
	var __commonJSMin = (cb, mod) => () => (mod || (cb((mod = { exports: {} }).exports, mod, mod.exports), cb = null), mod.exports);

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
	const isFunction = (v) => typeof v === "function";

// src/reactive.js
	const RAW = Symbol("wex.raw");
	let afterFlush = null;
	const setAfterFlush = (fn) => {
		afterFlush = fn;
	};
	let activeEffect = null;
	let seq = 0;
	const toRaw = (v) => v && typeof v === "object" && v[RAW] || v;
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

// src/wex.js
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
	const globalDirectives = /* @__PURE__ */ new Map();
	let globalVer = 0;
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
	function directive(name, compile, affect, priority) {
		globalDirectives.set(name, normDirective(compile, affect));
		globalVer++;
	}
	let postQ = [];
	let postDepth = 0;
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
	const nativeImport = new Function("u", "return import(u)");

// src/plugins/editor/wex-doc.js
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
	const ALIGNS = [
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
	function protect(el, onDestroy) {
		el.__jQvmComponent = {
			__cancelled: false,
			update() {},
			unmount() {
				if (onDestroy) onDestroy();
			}
		};
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
	const alignAttr = (a) => ALIGNS.includes(a) ? ` style="text-align:${a}"` : "";
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
	directive("w-doc", null, function($el, attrs) {
		const el = $el[0];
		const expr = attrs["w-doc"];
		let doc;
		try {
			doc = this.scope.parse(expr);
		} catch (e) {
			report(`w-doc: ошибка в выражении «${expr}»: ${e.message}`, {
				view: this.view,
				el,
				expr,
				level: "error"
			});
			return;
		}
		el.classList.add("wxe-doc");
		const key = stable(doc);
		if (el.__wdocKey === void 0) protect(el);
		if (el.__wdocKey !== key) {
			el.__wdocKey = key;
			el.innerHTML = renderDoc(doc);
		}
	});
	if (typeof window !== "undefined") window.WexDoc = {
		renderDoc,
		registerNode,
		renderNode,
		renderNodes,
		safeUrl,
		esc
	};

exports.FORMATS = FORMATS;
exports.addStyle = addStyle;
exports.classOk = classOk;
exports.clone = clone;
exports.emptyDoc = emptyDoc;
exports.esc = esc;
exports.isDoc = isDoc;
exports.protect = protect;
exports.registerNode = registerNode;
exports.renderChildren = renderChildren;
exports.renderDoc = renderDoc;
exports.renderNode = renderNode;
exports.renderNodes = renderNodes;
exports.safeUrl = safeUrl;
exports.stable = stable;
});