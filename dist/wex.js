(function(global, factory) {
	typeof exports === "object" && typeof module !== "undefined" ? factory(exports) : typeof define === "function" && define.amd ? define(["exports"], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, factory(global.jqvm = {}));
})(this, function(exports) {
	Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
	// \0rolldown/runtime.js
	var __commonJSMin = (cb, mod) => () => (mod || (cb((mod = { exports: {} }).exports, mod, mod.exports), cb = null), mod.exports);
	// src/vendor/ts-fns.js
	var import_ScopeX = (/* @__PURE__ */ __commonJSMin(((exports) => {
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
	})))();
	function isNone(value) {
		return value == null || typeof value === "number" && Number.isNaN(value);
	}
	function isString(value) {
		return typeof value === "string";
	}
	function isObject(value) {
		return value && typeof value === "object" && value.constructor === Object;
	}
	function unionArray(a, b) {
		return a.concat(b.filter((v) => !inArray(v, a)));
	}
	function inArray(item, arr) {
		return Array.isArray(arr) && arr.includes(item);
	}
	function isFunction(value, isStrict) {
		if (typeof value !== "function") return false;
		return isStrict ? !isConstructor(value, 2) : true;
	}
	function isConstructor(value, strict = 0) {
		if (typeof value !== "function") return false;
		try {
			Reflect.construct(String, [], value);
		} catch {
			return false;
		}
		if (strict === 0) return true;
		const source = Function.prototype.toString.call(value);
		const prototype = value.prototype;
		const isNative = /\{\s*\[native code\]\s*\}/.test(source);
		const isNativeClass = /^class\s/.test(source);
		const level4 = isNative || isNativeClass;
		if (strict >= 4) return level4;
		if (strict === 3) return level4;
		const keys = prototype ? Reflect.ownKeys(prototype).filter((key) => key !== "constructor") : [];
		const level2 = level4 || keys.length > 0;
		if (strict === 2) return level2;
		if (strict === 1) return level2 || /\bthis\s*[.[]/.test(source);
		return true;
	}
	function uniqueArray(arr, prop) {
		const exists = [];
		return arr.filter((item) => {
			const value = prop ? item[prop] : item;
			if (exists.includes(value)) return false;
			exists.push(value);
			return true;
		});
	}
	function each(obj, fn, withDescriptors = false) {
		if (withDescriptors) {
			const descriptors = Object.getOwnPropertyDescriptors(obj);
			Reflect.ownKeys(descriptors).forEach((key) => {
				const descriptor = descriptors[key];
				const { get, set, enumerable, configurable, writable } = descriptor;
				if (enumerable || get || set || configurable && writable) fn(descriptor, key, obj);
			});
			return;
		}
		if (Array.isArray(obj)) {
			obj.forEach((value, key) => fn(value, key, obj));
			return;
		}
		Object.keys(obj).forEach((key) => {
			fn(obj[key], key, obj);
		});
	}
	function isEqual(val1, val2) {
		const equal = (obj1, obj2) => {
			const keys1 = Object.getOwnPropertyNames(obj1);
			const keys2 = Object.getOwnPropertyNames(obj2);
			const keys = unionArray(keys1, keys2);
			for (let i = 0, len = keys.length; i < len; i++) {
				const key = keys[i];
				if (!inArray(key, keys1)) return false;
				if (!inArray(key, keys2)) return false;
				const value1 = obj1[key];
				const value2 = obj2[key];
				if (!isEqual(value1, value2)) return false;
			}
			return true;
		};
		if (isObject(val1) && isObject(val2)) return equal(val1, val2);
		else if (Array.isArray(val1) && Array.isArray(val2)) return equal(val1, val2);
		else return val1 === val2;
	}
	// src/utils.js
	function getNodeAttrs(el) {
		const oAttrs = [...el.attributes || []];
		const attrs = {};
		oAttrs.forEach((node) => {
			const { name, value } = node;
			attrs[name] = value;
		});
		return attrs;
	}
	function createAttrsText(attrs) {
		const attrsTexts = [];
		each(attrs, (value, key) => {
			attrsTexts.push(`${key}="${value}"`);
		});
		return attrsTexts.join(" ");
	}
	function camelCase(str) {
		return str.split(/\W|_/).filter((item) => !!item).map((item, i) => {
			if (i === 0) return item;
			return item.replace(item[0], item[0].toUpperCase());
		}).join("");
	}
	function parseKey(str) {
		const [, name, , _params] = str.match(/([a-zA-Z0-9_$]+)(\((.*?)\))?/);
		return [name, isString(_params) ? _params.split(",").map((item) => item.trim()).filter((item) => !!item) : void 0];
	}
	function getNodeName(node) {
		return node.nodeName.toLowerCase();
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
	const proxies = /* @__PURE__ */ new WeakMap();
	const subs = /* @__PURE__ */ new WeakMap();
	const parents = /* @__PURE__ */ new WeakMap();
	const hasOwn = (o, k) => Object.prototype.hasOwnProperty.call(o, k);
	const isPlain = (v) => {
		if (v === null || typeof v !== "object") return false;
		if (Array.isArray(v)) return true;
		const p = Object.getPrototypeOf(v);
		return p === Object.prototype || p === null;
	};
	const toRaw = (v) => v && typeof v === "object" && v[RAW] || v;
	const isReactive = (v) => !!(v && typeof v === "object" && v[RAW]);
	function link(child, parent) {
		let set = parents.get(child);
		if (!set) parents.set(child, set = /* @__PURE__ */ new Set());
		set.add(parent);
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
		get(target, key, receiver) {
			if (key === RAW) return target;
			if (Array.isArray(target) && hasOwn(searchers, key)) return searchers[key];
			const value = Reflect.get(target, key);
			if (typeof key === "symbol" || !isPlain(value)) return value;
			const d = Object.getOwnPropertyDescriptor(target, key);
			if (d && !d.configurable && !d.writable) return value;
			const raw = toRaw(value);
			link(raw, target);
			return reactive(raw);
		},
		set(target, key, value) {
			const next = toRaw(value);
			const had = hasOwn(target, key);
			const prev = target[key];
			const ok = Reflect.set(target, key, next);
			if (ok && (!had || prev !== next)) {
				if (isPlain(next)) link(next, target);
				notify(target, {
					target,
					key,
					type: had ? "set" : "add"
				});
			}
			return ok;
		},
		deleteProperty(target, key) {
			const had = hasOwn(target, key);
			const ok = Reflect.deleteProperty(target, key);
			if (ok && had) notify(target, {
				target,
				key,
				type: "delete"
			});
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
	function subscribe(target, fn) {
		const raw = toRaw(target);
		let set = subs.get(raw);
		if (!set) subs.set(raw, set = /* @__PURE__ */ new Set());
		set.add(fn);
		return () => {
			set.delete(fn);
		};
	}
	// src/wex.js
	if (!import_ScopeX.ScopeX.prototype.$new.__shared) {
		const isPlainObj = (v) => v && typeof v === "object" && v.constructor === Object;
		const sharedNew = function(locals) {
			locals = locals || {};
			const data = isPlainObj(locals) ? Object.setPrototypeOf(locals, this.data) : Object.assign({}, locals);
			const child = Object.create(import_ScopeX.ScopeX.prototype);
			child.options = this.options;
			child.filters = this.filters;
			child.compile = this.compile;
			child.data = data;
			return child;
		};
		sharedNew.__shared = true;
		import_ScopeX.ScopeX.prototype.$new = sharedNew;
	}
	let vmId = 0;
	let $$1 = null;
	function View() {}
	const SYMBOL = {};
	const config = {
		debug: typeof window !== "undefined" && window.WEX_DEBUG !== void 0 ? !!window.WEX_DEBUG : typeof location !== "undefined" && /^(localhost|127\.|\[::1\])/.test(location.hostname),
		maxDepth: 50,
		syncMounts: 50,
		mountBudget: 10
	};
	const reported = /* @__PURE__ */ new Set();
	const profile = typeof window !== "undefined" && window.WEX_PROFILE ? window.WEX_STATS = {
		compile: 0,
		diff: 0,
		affect: 0,
		renders: 0
	} : null;
	function scopeSnapshot(scp) {
		const out = {};
		try {
			const data = scp.data || {};
			for (const k in data) {
				const v = data[k];
				out[k] = v && typeof v === "object" ? Array.isArray(v) ? `Array(${v.length})` : `{${Object.keys(v).slice(0, 6).join(", ")}}` : v;
			}
		} catch (e) {}
		return out;
	}
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
		if (ctx.source) console.log("Место в шаблоне:", ctx.source);
		if (ctx.scope) console.log("Доступные переменные:", scopeSnapshot(ctx.scope));
		if (ctx.el) console.log("Элемент (можно кликнуть):", ctx.el);
		if (ctx.hint) console.log("Подсказка:", ctx.hint);
		console.groupEnd();
	}
	function safeParse(scp, exp, ctx) {
		try {
			return scp.parse(exp);
		} catch (e) {
			report(`Ошибка в выражении «${exp}»: ${e.message}`, {
				...ctx,
				expr: exp,
				scope: scp,
				level: "error"
			});
			return;
		}
	}
	function checkInterpolation(text, scp, ctx) {
		if (!config.debug || text.indexOf("{{") === -1) return;
		text.replace(/\{\{([\s\S]+?)\}\}/g, (m, raw) => {
			const expr = raw.trim();
			try {
				const v = scp.parse(expr);
				if (isNone(v)) report(`«{{ ${expr} }}» вернул ${v}`, {
					...ctx,
					expr,
					scope: scp
				});
			} catch (e) {
				if (expr.indexOf("|") === -1) report(`Ошибка в «{{ ${expr} }}»: ${e.message}`, {
					...ctx,
					expr,
					scope: scp,
					level: "error"
				});
			}
			return m;
		});
	}
	const globalComponents = [];
	const globalDirectives = [];
	const globalFilters = {};
	function _push(list, name, compile, affect, priority = 10) {
		for (let i = 0, len = list.length; i < len; i++) {
			const item = list[i];
			if (item[0] === name) {
				list[i] = [
					name,
					compile,
					affect,
					priority
				];
				return;
			}
			if (item[3] < priority) {
				list.splice(i, 0, [
					name,
					compile,
					affect,
					priority
				]);
				return;
			}
		}
		list.push([
			name,
			compile,
			affect,
			priority
		]);
	}
	function lifecycleAffect(name, def) {
		return function($el, attrs) {
			const el = $el[0];
			const bag = el.__wDirs || (el.__wDirs = {});
			let rec = bag[name];
			if (!rec) {
				rec = bag[name] = {
					def,
					data: {},
					ctx: this
				};
				if (def.mounted) def.mounted.call(this, $el, attrs, rec.data);
			} else {
				rec.ctx = this;
				if (def.updated) def.updated.call(this, $el, attrs, rec.data);
			}
		};
	}
	function normalizeDirective(name, compile, affect, priority) {
		if (compile && typeof compile === "object" && !(compile instanceof View)) {
			const def = compile;
			return [
				def.compile || null,
				lifecycleAffect(name, def),
				def.priority !== void 0 ? def.priority : priority
			];
		}
		return [
			compile,
			affect,
			priority
		];
	}
	function teardownDirectives(el) {
		const run = (node) => {
			const bag = node.__wDirs;
			if (!bag) return;
			delete node.__wDirs;
			Object.keys(bag).forEach((name) => {
				const rec = bag[name];
				if (!rec.def.unmounted) return;
				try {
					rec.def.unmounted.call(rec.ctx, $$1(node), rec.data);
				} catch (e) {
					console.error(e);
				}
			});
		};
		run(el);
		if (el.querySelectorAll) el.querySelectorAll("*").forEach(run);
	}
	function disposeNode(node) {
		if (node.nodeType !== 1) return;
		[node, ...node.querySelectorAll("*")].forEach((el) => {
			const comp = el.__jQvmComponent;
			if (comp) {
				comp.__cancelled = true;
				comp.unmount();
				delete el.__jQvmComponent;
			}
		});
		teardownDirectives(node);
	}
	function component(name, compile, affect) {
		_push(globalComponents, name, compile, affect);
	}
	function directive(name, compile, affect, priority) {
		const [c, a, p] = normalizeDirective(name, compile, affect, priority);
		_push(globalDirectives, name, c, a, p);
	}
	function filter(name, fn) {
		globalFilters[name] = fn;
	}
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
			const $tpl = $$1(`<template>${tpl.innerHTML}</template>`);
			const code = doc.querySelector("script[type=\"module\"]")?.textContent;
			let view = null;
			if (code) {
				const blobUrl = URL.createObjectURL(new Blob([code], { type: "text/javascript" }));
				try {
					view = (await nativeImport(blobUrl)).default($tpl);
				} finally {
					URL.revokeObjectURL(blobUrl);
				}
			} else view = $tpl.vm();
			if (!(view instanceof View)) throw new Error(`Wex: ${url} must export default a function returning a view`);
			entry.view = view;
			const waiters = [...entry.waiters];
			entry.waiters.clear();
			waiters.forEach((v) => {
				try {
					v.update(true);
				} catch (e) {
					console.error(`Wex: ошибка обновления после загрузки ${url}`, e);
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
	function prepare($root) {
		const root = $root[0];
		const records = root.__jQvmCompiledRecords = root.__jQvmCompiledRecords || [];
		if (!records.length) return;
		records.forEach((record) => {
			if (record.revoke) record.revoke();
		});
		records.length = 0;
	}
	function compile($root, components, directives, state, view, [template, scope, isolate]) {
		if (config.debug && /<(img|iframe|source|video|audio|script|link)\b[^>]*\s(src|href|srcset)\s*=\s*["'][^"']*\{\{/i.test(template)) report("«{{ }}» внутри src/href: браузер запросит сырую строку и получит 404", {
			view,
			level: "error",
			source: template.slice(0, 160),
			hint: "Используйте w-src=\"выражение\" вместо src=\"{{ }}\""
		});
		const root = $root[0];
		const records = root.__jQvmCompiledRecords = root.__jQvmCompiledRecords || [];
		const entry = protoOf(template);
		const box = entry.box.cloneNode(true);
		let dynamic = false;
		const interpolateNode = (el, scp) => {
			if (el.attributes.length) {
				const list = [...el.attributes];
				for (let i = 0; i < list.length; i++) {
					const { name, value } = list[i];
					if (name.charCodeAt(0) === 64 || value.indexOf("{{") === -1) continue;
					checkInterpolation(value, scp, {
						view,
						el,
						attr: name
					});
					const text = interpolateText(scp, value);
					if ((text === "undefined" || text === "null") && /^\{\{[^}]+\}\}$/.test(value.trim())) {
						el.removeAttribute(name);
						continue;
					}
					setAttrSafe(el, name, text);
				}
			}
			for (let child = el.firstChild; child; child = child.nextSibling) if (child.nodeType === 3) {
				const text = child.textContent;
				if (text.indexOf("{{") !== -1) {
					checkInterpolation(text, scp, {
						view,
						el
					});
					child.textContent = interpolateText(scp, text);
				}
			} else if (child.nodeType === 1) interpolateNode(child, scp);
		};
		const interpolate = ($el, scp = scope) => {
			$el.each(function() {
				interpolateNode(this, scp);
			});
		};
		const createIterator = (onCompile, onAffect, markDynamic) => function() {
			const el = this;
			if (el.__jQvmIterated) return;
			const attrs = getNodeAttrs(el);
			const name = getNodeName(el);
			const els = [el];
			const inner = el.innerHTML;
			const slot = (locals) => {
				const $root = $$1("<div />");
				const subScope = locals ? locals instanceof import_ScopeX.ScopeX ? scope.$new(locals.data) : scope.$new(locals) : scope;
				const nodes = compile($root, components, directives, state, view, [inner, subScope]);
				affect($root, scope, view);
				return nodes;
			};
			slot.template = inner;
			slot.nodes = [...el.childNodes];
			const record = {
				affect: onAffect,
				attrs,
				els,
				slot,
				scope,
				source: config.debug ? el.outerHTML.slice(0, 160) : ""
			};
			const useComponent = (proto) => {
				record.view = proto;
				record.name = name;
				record.state = state;
				if (proto.tag !== "template") {
					const { tag, attributes } = proto;
					const doc = el.ownerDocument;
					const tagEl = doc.createElement(tag);
					const attrsText = createAttrsText(attrs);
					const begin = doc.createComment(` ${name} ${attrsText} begin `);
					const end = doc.createComment(` ${name} ${attrsText} end `);
					Object.assign(attrs, attributes, { ["data-hoist"]: name });
					Object.keys(attrs).forEach((k) => setAttrSafe(tagEl, k, attrs[k]));
					el.replaceWith(begin, tagEl, end);
					els.length = 0;
					els.push(begin, tagEl, end);
				} else el.textContent = "";
			};
			if (onCompile instanceof View) useComponent(onCompile);
			else if (typeof onCompile === "function") {
				const $el = $$1(el);
				const boundCompile = compile.bind(null, $root, components, directives, state, view);
				const ctx = {
					scope,
					view,
					compile: (temp, scp = scope) => boundCompile([temp, scp]),
					interpolate
				};
				const output = onCompile.call(ctx, $el, attrs, slot);
				if (output && output instanceof View) useComponent(output);
				else if (!isNone(output) && $el !== output) {
					if (markDynamic) markDynamic();
					const newEls = $$1("<div />").html(output)[0].childNodes;
					$el.replaceWith(newEls);
					els.length = 0;
					els.push(...newEls);
				}
			}
			records.push(record);
			el.__jQvmIterated = true;
			els.forEach((item) => {
				item.__jQvmCompiledRecord = record;
				item.__jQvmIterated = true;
			});
		};
		directives.forEach(([name, onCompile, onAffect]) => {
			const selector = selectorOf(name);
			if (!dynamic && !protoHas(entry, selector)) return;
			const found = box.querySelectorAll(selector);
			for (let i = 0; i < found.length; i++) {
				const el = found[i];
				const attrs = getNodeAttrs(el);
				let els = [el];
				if (typeof onCompile === "function") {
					const boundCompile = compile.bind(null, $root, components, directives, state, view);
					const ctx = {
						scope,
						view,
						compile: (temp, scp = scope, isl = isolate) => boundCompile([
							temp,
							scp,
							isl
						]),
						interpolate
					};
					if (onCompile.native) {
						const output = onCompile.call(ctx, el, attrs);
						if (!isNone(output) && output !== el) {
							const nodes = toNodes(output);
							if (!(nodes.length === 1 && nodes[0].nodeType === 8)) dynamic = true;
							el.replaceWith(...nodes);
							els = nodes;
						}
					} else {
						const $el = $$1(el);
						const output = onCompile.call(ctx, $el, attrs);
						if (!isNone(output) && $el !== output) {
							dynamic = true;
							const $newEls = $$1(output);
							$el.replaceWith($newEls);
							els = [...$newEls];
						}
					}
				}
				if (isolate) el.removeAttribute(name);
				const record = {
					affect: onAffect,
					attrs,
					els,
					scope
				};
				records.push(record);
				els.forEach((item) => item.__jQvmCompiledRecord = record);
			}
		});
		components.forEach(([name, compile, affect]) => {
			if (name === "slot") return;
			if (!dynamic && !protoHas(entry, name)) return;
			const iterate = createIterator(compile, affect, () => {
				dynamic = true;
			});
			const found = box.querySelectorAll(name);
			for (let i = 0; i < found.length; i++) iterate.call(found[i]);
		});
		interpolateNode(box, scope);
		const slotComponent = components.find((item) => item[0] === "slot");
		if (slotComponent && (dynamic || protoHas(entry, "slot"))) {
			const [name, compile, affect] = slotComponent;
			const iterate = createIterator(compile, affect);
			const found = box.querySelectorAll(name);
			for (let i = 0; i < found.length; i++) iterate.call(found[i]);
		}
		return [...box.childNodes];
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
	function interpolateText(scp, str) {
		const parts = parseMustache(str);
		if (!parts.length) return str;
		let out = "";
		for (let i = 0; i < parts.length; i++) {
			const part = parts[i];
			out += typeof part === "string" ? part : String(scp.parse(part.expr));
		}
		return out;
	}
	let inertDoc = null;
	const protoCache = /* @__PURE__ */ new Map();
	function protoOf(html) {
		let entry = protoCache.get(html);
		if (!entry) {
			inertDoc = inertDoc || document.implementation.createHTMLDocument("");
			const box = inertDoc.createElement("div");
			box.innerHTML = html;
			if (protoCache.size > 2e3) protoCache.clear();
			entry = {
				box,
				has: /* @__PURE__ */ new Map()
			};
			protoCache.set(html, entry);
		}
		return entry;
	}
	const selCache = /* @__PURE__ */ new Map();
	const selectorOf = (name) => {
		let sel = selCache.get(name);
		if (!sel) selCache.set(name, sel = "[" + name + "]");
		return sel;
	};
	function protoHas(entry, selector) {
		let v = entry.has.get(selector);
		if (v === void 0) {
			v = entry.box.querySelector(selector) !== null;
			entry.has.set(selector, v);
		}
		return v;
	}
	function keyOf(node) {
		if (node.nodeType !== 1) return void 0;
		if (node.__wKey !== void 0) return node.__wKey;
		const id = node.getAttribute("id");
		if (id) return "g|id|" + id;
		const d = node.getAttribute("data-id");
		if (d !== null) return "l|" + node.nodeName + "|" + d;
	}
	const IGNORE_ATTRS = [
		"style",
		"class",
		"w-name"
	];
	const attrNames = (el) => [...el.attributes].map((a) => a.name).filter((n) => IGNORE_ATTRS.indexOf(n) === -1);
	function toNodes(output) {
		if (typeof output === "string") {
			const tpl = document.createElement("template");
			tpl.innerHTML = output;
			return [...tpl.content.childNodes];
		}
		if (output.nodeType) return [output];
		return [...output];
	}
	function setAttrSafe(el, name, value) {
		try {
			el.setAttribute(name, value);
		} catch (e) {
			$$1(el).attr(name, value);
		}
	}
	function diffAndPatch($root, nodes) {
		const claimed = /* @__PURE__ */ new Set();
		const pending = [];
		const localCache = /* @__PURE__ */ new Map();
		let globalIdx = null;
		const addTo = (map, key, el) => {
			const list = map.get(key);
			if (list) list.push(el);
			else map.set(key, [el]);
		};
		const localIndex = (parent) => {
			let map = localCache.get(parent);
			if (!map) {
				map = /* @__PURE__ */ new Map();
				for (let c = parent.firstElementChild; c; c = c.nextElementSibling) {
					const k = keyOf(c);
					if (k !== void 0) addTo(map, k, c);
				}
				localCache.set(parent, map);
			}
			return map;
		};
		const globalIndex = () => {
			if (!globalIdx) {
				globalIdx = /* @__PURE__ */ new Map();
				const walk = (el) => {
					for (let c = el.firstElementChild; c; c = c.nextElementSibling) {
						const k = keyOf(c);
						if (k !== void 0 && k[0] === "g") addTo(globalIdx, k, c);
						if (!c.__jQvmComponent) walk(c);
					}
				};
				walk($root[0]);
			}
			return globalIdx;
		};
		const pick = (list) => {
			if (!list) return null;
			for (let i = 0; i < list.length; i++) if (!claimed.has(list[i])) return list[i];
			return null;
		};
		const take = (key, parent) => {
			let el = pick(localIndex(parent).get(key));
			if (!el && key[0] === "g") el = pick(globalIndex().get(key));
			if (el) claimed.add(el);
			return el;
		};
		const transferRecord = (current, next) => {
			const record = next.__jQvmCompiledRecord;
			if (!record) return;
			const { els } = record;
			els.forEach((el, i) => {
				if (el === next) els[i] = current;
			});
			current.__jQvmCompiledRecord = record;
		};
		const patchAttrs = (current, next) => {
			const na = next.attributes;
			for (let i = 0; i < na.length; i++) {
				const { name, value } = na[i];
				if (current.getAttribute(name) !== value) setAttrSafe(current, name, value);
			}
			const ca = current.attributes;
			for (let i = ca.length - 1; i >= 0; i--) {
				const name = ca[i].name;
				if (name === "style" || name === "class" || name === "w-name") continue;
				if (!next.hasAttribute(name)) current.removeAttribute(name);
			}
		};
		const patchNode = (current, next) => {
			const isComp = !!current.__jQvmComponent;
			let pre = null;
			if (isComp) pre = {
				wName: current.getAttribute("w-name"),
				id: current.getAttribute("id"),
				dataId: current.getAttribute("data-id"),
				names: attrNames(current)
			};
			patchAttrs(current, next);
			if (next.__wKey !== void 0) current.__wKey = next.__wKey;
			transferRecord(current, next);
			if (isComp && current.nodeName === next.nodeName) {
				if (pre.wName === next.getAttribute("w-name")) return;
				const nid = next.getAttribute("id");
				if ((pre.id || nid) && pre.id === nid) return;
				const nd = next.getAttribute("data-id");
				if ((pre.dataId || nd) && pre.dataId === nd) return;
				if (current.getAttribute("data-hoist") === next.getAttribute("data-hoist") && isEqual(pre.names, attrNames(next))) return;
			}
			diffAndPatchChildren(current, [...next.childNodes]);
		};
		const diffAndPatchChildren = (parentNode, nextChildren) => {
			if (!parentNode.childNodes.length && !nextChildren.some((n) => keyOf(n) !== void 0)) {
				nextChildren.forEach((child) => {
					parentNode.appendChild(child);
				});
				return;
			}
			nextChildren.forEach((next, i) => {
				const current = parentNode.childNodes[i] || null;
				const key = keyOf(next);
				if (key !== void 0) {
					const found = take(key, parentNode);
					if (found) {
						if (found !== current) parentNode.insertBefore(found, current);
						patchNode(found, next);
					} else parentNode.insertBefore(next, current);
				} else if (!current) parentNode.appendChild(next);
				else if (next.nodeName !== current.nodeName || keyOf(current) !== void 0) parentNode.insertBefore(next, current);
				else if (next.nodeName.indexOf("#") !== 0) patchNode(current, next);
				else if (next.textContent !== current.textContent) current.textContent = next.textContent;
			});
			for (let i = parentNode.childNodes.length - 1, start = nextChildren.length; i >= start; i--) pending.push(parentNode.childNodes[i]);
		};
		diffAndPatchChildren($root[0], nodes);
		pending.forEach((node) => {
			const parent = node.parentNode;
			if (claimed.has(node) || !parent) return;
			disposeNode(node);
			parent.removeChild(node);
		});
	}
	const mountQueue = [];
	let mountScheduled = false;
	let flushing = false;
	let collecting = null;
	let syncCount = 0;
	const nextFrame = (fn) => document.hidden ? setTimeout(fn, 0) : requestAnimationFrame(fn);
	function shouldDefer() {
		return flushing || syncCount >= config.syncMounts;
	}
	function noteSyncMount() {
		if (syncCount === 0) Promise.resolve().then(() => {
			syncCount = 0;
		});
		syncCount++;
	}
	function scheduleMount(job) {
		if (collecting) collecting.push(job);
		else mountQueue.push(job);
		if (!mountScheduled) {
			mountScheduled = true;
			nextFrame(flushMounts);
		}
	}
	function flushMounts() {
		mountScheduled = false;
		flushing = true;
		const start = performance.now();
		while (mountQueue.length && performance.now() - start < config.mountBudget) {
			const job = mountQueue.shift();
			collecting = [];
			try {
				job();
			} catch (e) {
				console.error(e);
			}
			if (collecting.length) mountQueue.unshift(...collecting);
			collecting = null;
		}
		flushing = false;
		if (mountQueue.length) {
			mountScheduled = true;
			nextFrame(flushMounts);
		}
	}
	function affect($root, scope, view) {
		const root = $root[0];
		(root.__jQvmCompiledRecords = root.__jQvmCompiledRecords || []).forEach((record) => {
			const { affect, attrs, els, view: proto, scope: localScope, name, source } = record;
			const finalScope = localScope && localScope !== scope ? localScope : scope;
			if (proto) {
				const { state, slot } = record;
				const slotInner = slot.template.trim();
				els.forEach((el) => {
					if (el.nodeName.indexOf("#") === 0) return;
					const $el = $$1(el);
					let component = el.__jQvmComponent;
					const isNew = !component;
					if (isNew) {
						const parentPath = view.__path || ["root"];
						if (parentPath.length > config.maxDepth) {
							report(`Превышена глубина вложенности компонентов (${config.maxDepth}), «${name}» не создан`, {
								level: "error",
								view,
								el,
								source,
								hint: "Рекурсивный компонент без условия выхода или циклические данные. Остановите рекурсию через w-if."
							});
							$el.empty().attr("data-wex-error", "max-depth");
							return;
						}
						component = proto.clone();
						component.__path = parentPath.concat(name);
					}
					record.component = component;
					const outside = {};
					each(attrs, (exp, attr) => {
						if (attr.indexOf(":") === 0) {
							const ctx = {
								view,
								el,
								attr,
								expr: exp,
								source
							};
							const value = safeParse(finalScope, exp, ctx);
							if (isNone(value)) report(`Проп «${attr.substring(1)}» компонента «${name}» получил ${value}`, {
								...ctx,
								scope: finalScope
							});
							outside[camelCase(attr.substring(1))] = value;
						} else if (attr.indexOf("@") === 0) {
							const event = camelCase(attr.substring(1));
							const [fname, params] = parseKey(exp);
							const fn = view.fn(fname);
							outside["@" + event] = function(...args) {
								let res = null;
								if (params) {
									const values = params.map((arg) => finalScope.parse(arg));
									res = fn.call(view, state, ...values);
								} else res = fn.call(view, state);
								if (isFunction(res)) return res.apply(this, args);
							};
						} else if (attr.indexOf("_") !== 0) outside[camelCase(attr)] = exp;
					});
					component.update(outside, SYMBOL);
					component.component("slot", function() {
						const { scope } = this;
						return slotInner ? slot(scope) : "";
					});
					if (isNew) {
						el.__jQvmComponent = component;
						if (shouldDefer()) {
							component.__pending = true;
							scheduleMount(() => {
								component.__pending = false;
								if (el.__jQvmComponent !== component || component.__cancelled) return;
								component.mount($el);
							});
						} else {
							noteSyncMount();
							component.mount($el);
						}
					} else if (component.__pending) {} else if (!$el.attr("w-name")) component.mount($el);
					else if (slotInner) component.update(true);
				});
				els.forEach((el) => {
					delete el.__jQvmCompiledRecord;
				});
			}
			if (typeof affect !== "function") return;
			els.forEach((el) => {
				const $el = $$1(el);
				const ctx = {
					$root,
					scope: finalScope,
					view,
					component: record.component
				};
				const revoke = affect.call(ctx, $el, attrs);
				if (typeof revoke === "function") record.revoke = revoke;
			});
		});
	}
	function cloneState(value) {
		if (Array.isArray(value)) return value.map(cloneState);
		if (value && Object.getPrototypeOf(value) === Object.prototype) {
			const out = {};
			Object.keys(value).forEach((k) => {
				out[k] = cloneState(value[k]);
			});
			return out;
		}
		return value;
	}
	function vm(initState = {}) {
		const template = this;
		const $template = $$1(template);
		const hash = $template.attr("id") || $template.attr("w-id") || (vmId++, vmId);
		const root = `[w-name=${hash}]`;
		let state = null;
		let scope = null;
		let outside = null;
		let mountTo = null;
		let isMounted = false;
		let isUnmounted = false;
		let rootEl = null;
		let templateHtml = null;
		const getTemplateHtml = () => templateHtml === null ? templateHtml = $template.html() : templateHtml;
		const getMountNode = () => {
			return mountTo ? $$1(mountTo) : $template.next(root);
		};
		const actions = [];
		const view = new View();
		const components = [...globalComponents];
		const directives = [...globalDirectives];
		const filters = { ...globalFilters };
		const fns = {};
		function component(name, compile, affect) {
			if (isString(compile)) {
				const entry = loadRemote(compile, affect);
				const placeholder = () => {
					entry.load();
					return entry.view || "";
				};
				placeholder.remote = entry;
				compile = placeholder;
				affect = void 0;
			}
			if (compile && compile.remote) {
				const { remote } = compile;
				if (remote.view) view.update(true);
				else remote.waiters.add(view);
			}
			_push(components, name, compile, affect);
			if (compile && compile instanceof View) view.on("$beforeDestroy", () => compile.destroy());
			return view;
		}
		function directive(name, compile, affect, priority) {
			const [c, a, p] = normalizeDirective(name, compile, affect, priority);
			_push(directives, name, c, a, p);
			return view;
		}
		function filter(name, fn) {
			filters[name] = fn;
			return view;
		}
		let dirty = false;
		let queued = false;
		let held = 0;
		let skipped = false;
		let lastInfo = null;
		let unsubscribe = null;
		const schedule = (info) => {
			lastInfo = info;
			dirty = true;
			if (queued || held || !isMounted) return;
			queued = true;
			Promise.resolve().then(flush);
		};
		function flush() {
			queued = false;
			if (!dirty || held || !state || !isMounted) return;
			dirty = false;
			if (change(lastInfo)) render(true);
		}
		const assignOutsideState = (state, outsideState) => {
			if (!state) return false;
			const keys = {};
			Object.keys(state).forEach((k) => {
				keys[k.toLowerCase()] = k;
			});
			let changed = false;
			each(outsideState, (value, key) => {
				if (key[0] === "@") return;
				const realKey = key in state ? key : keys[key.toLowerCase()];
				if (!realKey) return;
				const prev = toRaw(state[realKey]);
				const next = toRaw(value);
				if (prev === next) return;
				if (!isReactive(value) && isEqual(prev, next)) return;
				state[realKey] = next;
				changed = true;
			});
			return changed;
		};
		function init(initState) {
			const next = isFunction(initState) ? initState.call(view) : initState;
			if (!next || typeof next !== "object") throw new Error("initState should must be an object");
			state = reactive(next);
			if (outside) assignOutsideState(state, outside);
			unsubscribe = subscribe(state, schedule);
			scope = new import_ScopeX.ScopeX(state, { filters });
			setupSpecialEvents();
			view.emit("$init");
		}
		function render(isUpdating) {
			if (isUpdating && !isMounted) return;
			if (!shouldUpdate()) {
				skipped = true;
				return;
			}
			skipped = false;
			const $root = getMountNode();
			const t0 = profile ? performance.now() : 0;
			prepare($root);
			const nodes = compile($root, components, directives, state, view, [getTemplateHtml(), scope]);
			const t1 = profile ? performance.now() : 0;
			if (isUpdating) diffAndPatch($root, nodes);
			else $root.html(nodes);
			const t2 = profile ? performance.now() : 0;
			affect($root, scope, view);
			if (profile) {
				profile.compile += t1 - t0;
				profile.diff += t2 - t1;
				profile.affect += performance.now() - t2;
				profile.renders++;
			}
			const attrs = $template.attr("attrs");
			if (attrs) each(scope.parse(attrs), (value, key) => {
				if (key === "class") value.split(" ").forEach((item) => $root.addClass(item));
				else if (key === "style") {
					if (isObject(value)) $root.css(value);
					else if (isString(value)) {
						const stylesheet = uniqueArray(($root.attr("style") || "").split(";").concat(value.split(";")).filter((item) => !!item)).join(";");
						$root.attr("style", stylesheet);
					}
				} else $root.attr(key, value);
			});
			$template.trigger("$render");
		}
		function change(info) {
			let flag = true;
			const prevent = () => flag = false;
			$template.trigger("$change", [
				state,
				info,
				prevent
			]);
			if (flag) VMLocalStorage.reloadJqvmLocalStorage(state, "$change");
			return flag;
		}
		function shouldUpdate() {
			let flag = true;
			const prevent = () => flag = false;
			$template.trigger("$update", [state, prevent]);
			return flag;
		}
		function mount(el) {
			if (isMounted) {
				if (el) {
					if (el === mountTo) return view;
					view.unmount();
				} else return view;
			}
			if ($template.next(root).length) return view;
			if (!isUnmounted) init(initState);
			let $root = null;
			mountTo = el || null;
			if (el) {
				$root = $$1(el);
				$root.attr("w-name", hash);
			} else if (!$$1(document).find($template).length) throw new Error("el should must be passed by view.mount");
			else {
				$root = $$1("<div />", { "w-name": hash });
				$template.after($root);
			}
			rootEl = $root[0];
			render();
			dirty = false;
			VMLocalStorage.reloadJqvmLocalStorage(state, "$mount");
			$template.trigger("$mount", [state]);
			isMounted = true;
			isUnmounted = false;
			return view;
		}
		function unmount() {
			if (!isMounted) return view;
			const $root = getMountNode();
			if (!$root.length) return;
			$template.trigger("$unmount");
			teardownDirectives($root[0]);
			if (mountTo) {
				$root.html("");
				$root.removeAttr("w-name");
			} else $root.remove();
			mountTo = null;
			rootEl = null;
			isMounted = false;
			isUnmounted = true;
			return view;
		}
		function destroy() {
			$template.trigger("$beforeDestroy");
			const $root = getMountNode();
			unmount();
			if (unsubscribe) unsubscribe();
			unsubscribe = null;
			state = null;
			scope = null;
			actions.length = 0;
			const root = $root[0];
			if (root) {
				delete root.__jQvmComponentInstances;
				delete root.__jQvmCompiledRecords;
			}
			$template.trigger("$destroy");
		}
		function update(nextState, type) {
			if (type === SYMBOL) {
				outside = nextState;
				if (state) assignOutsideState(state, nextState);
				return view;
			}
			if (nextState === true) {
				if (isMounted) {
					dirty = false;
					render(true);
				}
				return view;
			}
			if (state && nextState) {
				if (isFunction(nextState)) {
					const res = nextState(state);
					if (isObject(res)) Object.assign(state, res);
					else schedule(null);
				} else if (isObject(nextState)) Object.assign(state, nextState);
			}
			return view;
		}
		function hold() {
			held++;
			return view;
		}
		function release() {
			if (held > 0 && --held === 0) {
				if (dirty) flush();
				else if (skipped) render(true);
			}
			return view;
		}
		function bind(args, once) {
			const info = [...args];
			const fn = info.pop();
			const [event, selector] = info;
			const handle = function(e, ...eventArgs) {
				const event = e.handleObj.origType;
				if (event[0] === "$") {
					e.stopPropagation();
					if (e.target !== e.currentTarget) return;
				}
				let res = null;
				if (event[0] === "$") fn.call(view, state, ...eventArgs);
				else {
					const callback = fn.call(view, state);
					if (isFunction(callback)) res = callback.call(this, e, ...eventArgs);
				}
				if (once) unbind(args);
				return res;
			};
			const item = {
				once,
				event,
				selector,
				fn,
				handle
			};
			actions.push(item);
			if (isMounted) {
				const $root = getMountNode();
				const type = once ? "one" : "on";
				if (event[0] === "$") $template[type](event, handle);
				else {
					const info = [event, selector].filter(Boolean);
					$root[type](...info, handle);
				}
			}
		}
		function unbind(args) {
			const info = [...args];
			const fn = info.pop();
			const [event, selector] = info;
			const $root = getMountNode();
			actions.forEach((item, i) => {
				if (event === item.event && selector === item.selector && fn === item.fn) {
					const { event, selector, handle } = item;
					const args = [
						event,
						selector,
						handle
					].filter(Boolean);
					if (event[0] === "$") $template.off(...args);
					else $root.off(...args);
					actions.splice(i, 1);
				}
			});
		}
		function emit(event, ...args) {
			if (outside) {
				const lower = ("@" + event).toLowerCase();
				const key = "@" + event in outside ? "@" + event : Object.keys(outside).find((k) => k.toLowerCase() === lower);
				if (key && isFunction(outside[key])) outside[key](...args);
			}
			if (event[0] !== "$") return;
			if (actions.some((item) => item.event === event)) $template.trigger(event, args);
		}
		function setupSpecialEvents() {
			actions.forEach((item) => {
				const { event, handle } = item;
				if ([
					"$init",
					"$destroy",
					"$beforeDestroy",
					"$mount"
				].indexOf(event) === -1) return;
				$template.one(event, handle);
			});
		}
		function setup() {
			$template.on("$mount", function() {
				const $root = getMountNode();
				actions.forEach((item) => {
					const { once, event, selector, handle } = item;
					if ([
						"$init",
						"$destroy",
						"$beforeDestroy",
						"$mount",
						"$clone"
					].indexOf(event) > -1) return;
					const type = once ? "one" : "on";
					if (event[0] === "$") $template[type](event, handle);
					else {
						const info = [event, selector].filter(Boolean);
						$root[type](...info, handle);
					}
				});
			});
			$template.on("$unmount", () => {
				const $root = getMountNode();
				actions.forEach((item) => {
					const { event, selector, handle } = item;
					if (event[0] === "$") return;
					const info = [event, selector].filter(Boolean);
					$root.off(...info, handle);
				});
			});
		}
		function find(selector) {
			return getMountNode().find(selector);
		}
		function fn(name, action) {
			if (!action) return fns[name];
			else fns[name] = action;
			return view;
		}
		function clone() {
			const newView = vm.call($template.clone(), isFunction(initState) ? initState : cloneState(initState));
			each(fns, (action, name) => {
				newView.fn(name, action);
			});
			each(actions, (item) => {
				const { type, event, selector, fn } = item;
				const info = [event, selector].filter(Boolean);
				newView[type === "one" ? "once" : "on"](...info, fn);
			});
			each(components, (item) => {
				if (globalComponents.includes(item)) return;
				newView.component(...item);
			});
			each(directives, (item) => {
				if (globalDirectives.includes(item)) return;
				newView.directive(...item);
			});
			each(filters, (fn, name) => {
				newView.filter(name, fn);
			});
			actions.forEach((item) => {
				const { event, fn } = item;
				if (event !== "$clone") return;
				fn.call(view, state, newView);
			});
			return newView;
		}
		function plugin(fn) {
			const lifecycle = fn.call({
				view,
				scope
			});
			if (lifecycle) Object.keys(lifecycle).forEach((event) => {
				view.on(event, lifecycle[event]);
			});
			return view;
		}
		Object.assign(view, {
			once(...args) {
				bind(args, true);
				return view;
			},
			on(...args) {
				bind(args);
				return view;
			},
			off(...args) {
				unbind(args);
				return view;
			},
			emit,
			mount,
			unmount,
			destroy,
			update,
			hold,
			release,
			find,
			component,
			directive,
			filter,
			plugin,
			fn,
			method: fn,
			clone
		});
		const tempEl = $template[0];
		const tag = getNodeName(tempEl);
		const attributes = getNodeAttrs(tempEl);
		Object.defineProperties(view, {
			tag: { value: tag },
			attributes: { value: attributes },
			__state: { get: () => state },
			__root: { get: () => rootEl }
		});
		setup();
		return view;
	}
	const WFOR_RE = /^[a-z][a-zA-Z0-9_$]*(,[a-z][a-zA-Z0-9_$]*){0,1} in [a-z][a-zA-Z0-9_$]*( traceby [a-z][a-zA-Z0-9_$.]*)?/;
	function wFor(el, attrs) {
		const attr = attrs["w-for"];
		if (!WFOR_RE.test(attr)) throw new Error("w-for should match formatter `value,key in data traceby id`!");
		const doc = el.ownerDocument;
		const nodeName = getNodeName(el);
		const [kv, , dataKey, , traceBy] = attr.split(" ");
		const [valueName, keyName] = kv.split(",");
		const { scope: parentScope, compile } = this;
		const data = parentScope.parse(dataKey);
		if (config.debug && Array.isArray(data) && data.length === 0) report(`w-for «${attr}»: массив пустой, отрисовывать нечего`, {
			view: this.view,
			el,
			expr: dataKey,
			scope: parentScope,
			hint: "Если данные грузятся асинхронно, проверьте, что они дошли до этого компонента (см. пропсы)"
		});
		el.removeAttribute("w-for");
		if (traceBy) el.setAttribute("data-id", `{{${traceBy}}}`);
		const keyScope = nodeName + "|" + dataKey + "|" + traceBy;
		const frag = doc.createDocumentFragment();
		frag.appendChild(doc.createComment(` ${nodeName} w-for="${attr}" begin `));
		const temp = el.outerHTML;
		each(isNone(data) ? [] : data, (value, key) => {
			const newScope = { [valueName]: value };
			if (keyName) newScope[keyName] = key;
			const scope = parentScope.$new(newScope);
			const nodes = compile(temp, scope, true);
			for (let i = 0; i < nodes.length; i++) {
				const n = nodes[i];
				if (traceBy && n.nodeType === 1) {
					const id = n.getAttribute("data-id");
					if (id !== null) n.__wKey = "g|" + keyScope + "|" + id;
				}
				frag.appendChild(n);
			}
		});
		frag.appendChild(doc.createComment(` ${nodeName} w-for="${attr}" end `));
		el.replaceWith(frag);
	}
	wFor.native = true;
	directive("w-for", wFor);
	function sanitizeSvg(str) {
		const tpl = document.createElement("template");
		tpl.innerHTML = str;
		tpl.content.querySelectorAll("script,foreignObject,iframe,object,embed,style,animate,set").forEach((n) => n.remove());
		tpl.content.querySelectorAll("*").forEach((el) => {
			[...el.attributes].forEach(({ name, value }) => {
				const n = name.toLowerCase();
				const v = value.trim().toLowerCase();
				const badHref = (n === "href" || n === "xlink:href") && !v.startsWith("#");
				if (n.startsWith("on") || badHref) el.removeAttribute(name);
			});
		});
		return tpl.innerHTML;
	}
	function wHtml(el, attrs) {
		const exp = attrs["w-html"].replace(/^\{\{\s*|\s*\}\}$/g, "");
		const ctx = {
			view: this.view,
			el,
			attr: "w-html",
			expr: exp
		};
		const html = safeParse(this.scope, exp, ctx);
		if (isNone(html)) report(`w-html получил ${html}`, {
			...ctx,
			scope: this.scope
		});
		el.removeAttribute("w-html");
		el.innerHTML = sanitizeSvg(isNone(html) ? "" : String(html));
	}
	wHtml.native = true;
	directive("w-html", wHtml);
	function wIf(el, attrs) {
		const attr = attrs["w-if"];
		return this.scope.parse(attr) ? el : el.ownerDocument.createComment(` ${getNodeName(el)} w-if="${attr}" (hidden) `);
	}
	wIf.native = true;
	directive("w-if", wIf);
	function wId(el, attrs) {
		const value = this.scope.parse(attrs["w-id"]);
		if (value === null) el.removeAttribute("id");
		else if (value !== void 0) el.setAttribute("id", value);
	}
	wId.native = true;
	directive("w-id", wId);
	function wClass(el, attrs) {
		each(this.scope.parse(attrs["w-class"]), (value, key) => {
			if (value) {
				const names = key.split(/\s+/).filter(Boolean);
				if (names.length) el.classList.add(...names);
			}
		});
	}
	wClass.native = true;
	directive("w-class", wClass);
	directive("w-value", null, function($el, attrs) {
		const attr = attrs["w-value"];
		const value = this.scope.parse(attr);
		$el.val(value);
	});
	directive("w-disabled", null, function($el, attrs) {
		const attr = attrs["w-disabled"];
		const value = this.scope.parse(attr);
		$el.prop("disabled", !!value);
	});
	directive("w-checked", null, function($el, attrs) {
		const attr = attrs["w-checked"];
		const value = this.scope.parse(attr);
		$el.prop("checked", !!value);
	});
	directive("w-selected", null, function($el, attrs) {
		const attr = attrs["w-selected"];
		const value = this.scope.parse(attr);
		$el.prop("selected", !!value);
	});
	const BIND_CHANGE = "[type=checkbox],[type=radio],[type=color],[type=date],[type=datetime-local],[type=week],[type=file],select";
	function bindSync($el, ctx, attrs, data) {
		const attr = attrs["w-bind"];
		const value = ctx.scope.parse(attr);
		data.scope = ctx.scope;
		data.attr = attr;
		if ($el.is("[type=checkbox]")) $el.prop("checked", !!value);
		else if ($el.is("[type=radio]")) $el.prop("checked", value === $el.val());
		else $el.val(value);
	}
	directive("w-bind", {
		mounted($el, attrs, data) {
			const el = $el[0];
			const checkbox = el.matches("[type=checkbox]");
			bindSync($el, this, attrs, data);
			data.listener = (e) => {
				data.scope.assign(data.attr, checkbox ? el.checked : e.target.value);
			};
			el.addEventListener(el.matches(BIND_CHANGE) ? "change" : "input", data.listener);
		},
		updated($el, attrs, data) {
			bindSync($el, this, attrs, data);
		}
	});
	directive("w-src", null, function($el, attrs) {
		const attr = attrs["w-src"];
		const ctx = {
			view: this.view,
			el: $el[0],
			attr: "w-src",
			expr: attr
		};
		const value = safeParse(this.scope, attr, ctx);
		if (isNone(value)) {
			report(`w-src получил ${value}: src не выставлен, запрос не отправлен`, {
				...ctx,
				scope: this.scope
			});
			return;
		}
		$el.attr("src", value);
	});
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
	function delegateOn(root, event) {
		const set = root.__wDelegates || (root.__wDelegates = /* @__PURE__ */ new Set());
		if (set.has(event)) return;
		set.add(event);
		const direct = NON_BUBBLING.indexOf(event) !== -1;
		root.addEventListener(event, (e) => {
			let je = null;
			for (let el = e.target; el && el !== root; el = el.parentNode) {
				if (direct && el !== e.target) break;
				const h = el.__wOn && el.__wOn[event];
				if (!h || h.root !== root) continue;
				if (!je) {
					je = $$1.event && $$1.event.fix ? $$1.event.fix(e) : e;
					if (je !== e) je.delegateTarget = root;
				}
				if (je !== e) je.currentTarget = el;
				const state = h.view.__state;
				let res;
				if (h.params) {
					const args = h.params.map((arg) => h.scope.parse(arg));
					res = h.fn.call(h.view, state, ...args);
				} else res = h.fn.call(h.view, state);
				if (typeof res === "function") res = res.call(el, je);
				if (res === false) {
					je.preventDefault();
					je.stopPropagation();
				}
				if (je.isPropagationStopped ? je.isPropagationStopped() : e.cancelBubble) break;
			}
		}, direct);
	}
	directive("w-on", null, function($el, attrs) {
		const el = $el[0];
		const [event, method] = attrs["w-on"].split(":");
		const [name, params] = parseKey(method);
		const { view, scope } = this;
		const fn = view.fn(name);
		const root = view.__root;
		if (!fn || !root) return;
		const handlers = el.__wOn || (el.__wOn = {});
		handlers[event] = {
			root,
			fn,
			params,
			scope,
			view
		};
		delegateOn(root, event);
		return () => {
			delete handlers[event];
		};
	});
	directive("w-transition", null, function($el, attrs) {
		const el = $el[0];
		if (el.__wTransitionDone) return;
		el.__wTransitionDone = true;
		const transition = attrs["w-transition"] || "opacity 0.25s ease";
		const finalTransition = /(opacity|all|transform)/.test(transition) ? transition : `opacity ${transition}`;
		$el.css({
			transition: finalTransition,
			opacity: 0
		});
		const show = () => $el.css("opacity", 1);
		if (document.hidden) setTimeout(show, 0);
		else requestAnimationFrame(() => requestAnimationFrame(show));
		setTimeout(show, 500);
		const originalRemove = el.remove;
		el.remove = function() {
			$el.css("opacity", 0);
			const duration = getComputedStyle(el).transitionDuration;
			const ms = duration.includes("ms") ? parseFloat(duration) : parseFloat(duration) * 1e3;
			setTimeout(() => originalRemove.call(el), ms || 250);
		};
		return () => {
			el.remove = originalRemove;
		};
	});
	component("w-static", () => $$1("<template><slot></slot></template>").vm().on("$update", (state, e, prevent) => {
		prevent();
	}));
	function useJQuery(jQuery) {
		$$1 = jQuery;
		$$1.fn.vm = vm;
		$$1.fn.state = function(...args) {
			return this.vm(...args);
		};
		return $$1;
	}
	console.log("[Wex]: загружена версия: 1.3.5");
	// src/shared-state.js
	function shareState(initState, options = {}) {
		const state = reactive(initState);
		if (options.onChange) subscribe(state, ({ key, target }) => options.onChange(key, target[key]));
		return function() {
			if (options.drive) options.drive((arg) => this.update(arg));
			return state;
		};
	}
	// src/async.js
	function createAsyncComponent(defer, callback) {
		let component = null;
		let deferer = null;
		return function(...args) {
			if (!deferer) {
				const { view } = this;
				deferer = defer().then((res) => {
					if (typeof Symbol !== "undefined" && res && res[Symbol.toStringTag] === "Module") component = res.default;
					else if (res && res.__esModule) component = res.default;
					else component = res;
					if (callback) component = callback.call(view, component, ...args) || component;
					view.update(true);
				});
			}
			return component;
		};
	}
	// src/wire.js
	var strategies = {
		drop: function(serverState, key, incoming) {
			serverState[key] = incoming;
		},
		push: function(serverState, key, incoming) {
			var current = serverState[key];
			if (Array.isArray(current) && Array.isArray(incoming)) serverState[key] = current.concat(incoming);
			else serverState[key] = incoming;
		},
		nomerge: function() {},
		error: function(serverState, key, incoming, failHandlers) {
			var current = serverState[key];
			if (!(current === null || current === void 0 || Array.isArray(current) && current.length === 0 || typeof current === "object" && !Array.isArray(current) && Object.keys(current).length === 0)) {
				var err = /* @__PURE__ */ new Error("wire:error — ключ \"" + key + "\" уже содержит данные");
				err.strategy = "error";
				err.key = key;
				failHandlers.forEach(function(fn) {
					fn(err);
				});
				return;
			}
			serverState[key] = incoming;
		},
		merge: function(serverState, key, incoming) {
			var current = serverState[key];
			if (Array.isArray(current) && Array.isArray(incoming)) serverState[key] = current.concat(incoming);
			else serverState[key] = incoming;
		}
	};
	function defaultAjax(options) {
		if (typeof $ !== "undefined" && $.ajax) return $.ajax(options);
		throw new Error("$wire: jQuery не найден. Подключите jQuery или передайте ajax в опциях createWire.");
	}
	function createWire(options) {
		options = options || {};
		var ajaxFn = options.ajax || defaultAjax;
		var csrf = options.csrf || null;
		var pending = {};
		var listeners = {};
		function emit(event) {
			var args = Array.prototype.slice.call(arguments, 1);
			(listeners[event] || []).forEach(function(fn) {
				fn.apply(null, args);
			});
		}
		function on(event, fn) {
			if (!listeners[event]) listeners[event] = [];
			listeners[event].push(fn);
			return wire;
		}
		var prefetched = {};
		var ttl = options.prefetchTtl || 3e4;
		function buildOptions(method, url, data) {
			var o = {
				url,
				method: method.toUpperCase(),
				headers: {}
			};
			if (csrf) o.headers["X-CSRF-TOKEN"] = csrf;
			if (data && (method === "post" || method === "put")) {
				o.data = JSON.stringify(data);
				o.contentType = "application/json";
			}
			return o;
		}
		function prefetch(url) {
			var hit = prefetched[url];
			if (hit && Date.now() - hit.at < ttl) return wire;
			var entry = {
				req: ajaxFn(buildOptions("get", url)),
				at: Date.now()
			};
			prefetched[url] = entry;
			entry.req.fail(function() {
				if (prefetched[url] === entry) delete prefetched[url];
			});
			return wire;
		}
		function takePrefetched(url) {
			var hit = prefetched[url];
			if (!hit) return null;
			delete prefetched[url];
			return Date.now() - hit.at < ttl ? hit.req : null;
		}
		function request(method, url, data, strategy) {
			strategy = strategy || "drop";
			var doneHandlers = [];
			var failHandlers = [];
			var alwaysHandlers = [];
			var target = null;
			var chain = {
				to: function(ref, key) {
					target = key !== void 0 ? {
						__wire: true,
						obj: ref,
						key
					} : ref;
					return chain;
				},
				before: function(fn) {
					fn();
					return chain;
				},
				done: function(fn) {
					doneHandlers.push(fn);
					return chain;
				},
				fail: function(fn) {
					failHandlers.push(fn);
					return chain;
				},
				always: function(fn) {
					alwaysHandlers.push(fn);
					return chain;
				},
				withState: function(s) {
					return chain;
				}
			};
			pending[url] = true;
			emit("$wiring", "start", url);
			var cached = method === "get" ? takePrefetched(url) : null;
			var req = cached || ajaxFn(buildOptions(method, url, data));
			function attach() {
				req.done(function(responseData) {
					if (target) {
						if (target.__wire) (strategies[strategy] || strategies.drop)(target.obj, target.key, responseData, failHandlers);
						else if (Array.isArray(target)) {
							if (strategy !== "push") target.length = 0;
							if (Array.isArray(responseData)) Array.prototype.push.apply(target, responseData);
							else target.push(responseData);
						} else if (target && typeof target === "object") {
							if (strategy !== "push") Object.keys(target).forEach(function(k) {
								delete target[k];
							});
							if (responseData && typeof responseData === "object") Object.assign(target, responseData);
							else if (typeof console !== "undefined") console.warn("[wire] " + url + " вернул не объект/массив, а " + typeof responseData + ": записывать в .to() нечего");
						} else if (typeof console !== "undefined") console.warn("[wire] .to() получил " + Object.prototype.toString.call(target) + ": данные из " + url + " не записаны");
					}
					doneHandlers.forEach(function(fn) {
						fn(responseData);
					});
				});
				req.fail(function(jqXHR, textStatus) {
					if (typeof console !== "undefined") console.error("[wire] " + method.toUpperCase() + " " + url + " → " + (jqXHR && jqXHR.status) + " " + textStatus);
					failHandlers.forEach(function(fn) {
						fn(jqXHR, textStatus);
					});
				});
				req.always(function() {
					delete pending[url];
					emit("$wiring", "end", url);
					alwaysHandlers.forEach(function(fn) {
						fn();
					});
				});
			}
			if (cached) Promise.resolve().then(attach);
			else attach();
			return chain;
		}
		function wire(url) {
			if (url === void 0) return Object.keys(pending).length > 0;
			return !!pending[url];
		}
		wire.get = function(url, strategy) {
			return request("get", url, null, strategy);
		};
		wire.post = function(url, data, strategy) {
			return request("post", url, data, strategy);
		};
		wire.put = function(url, data, strategy) {
			return request("put", url, data, strategy);
		};
		wire.delete = function(url, strategy) {
			return request("delete", url, null, strategy);
		};
		wire.prefetch = prefetch;
		wire.on = on;
		return wire;
	}
	const $wire = createWire();
	// src/plugins/router/route-pattern.js
	const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	function compileRoute(pattern) {
		const keys = [];
		const tokenRe = /\{(\w+)(\?|\*)?(?::([^}]+))?\}/g;
		let src = "";
		let last = 0;
		let m;
		while (m = tokenRe.exec(pattern)) {
			let literal = pattern.slice(last, m.index);
			const [, name, mod, custom] = m;
			keys.push(name);
			if (mod === "?") {
				const slash = literal.endsWith("/");
				if (slash) literal = literal.slice(0, -1);
				src += esc(literal) + (slash ? "(?:/" : "(?:") + "(" + (custom || "[^/]+") + "))?";
			} else if (mod === "*") src += esc(literal) + "(" + (custom || ".*") + ")";
			else src += esc(literal) + "(" + (custom || "[^/]+") + ")";
			last = m.index + m[0].length;
		}
		src += esc(pattern.slice(last));
		return {
			regex: new RegExp("^" + src + "/?$"),
			keys
		};
	}
	function matchRoute(pattern, pathname) {
		if (pattern.startsWith("regex:")) {
			const body = pattern.slice(6).trim();
			const i = body.lastIndexOf("/");
			const m = new RegExp(body.slice(1, i), body.slice(i + 1)).exec(pathname);
			if (!m) return null;
			const params = {};
			m.slice(1).forEach((v, k) => {
				params[k] = v;
			});
			return params;
		}
		const { regex, keys } = compileRoute(pattern);
		const m = regex.exec(pathname);
		if (!m) return null;
		const params = {};
		keys.forEach((k, i) => {
			if (m[i + 1] !== void 0) params[k] = decodeURIComponent(m[i + 1]);
		});
		return params;
	}
	function buildRoute(pattern, params = {}) {
		const used = /* @__PURE__ */ new Set();
		let url = pattern.replace(/(\/?)\{(\w+)(\?|\*)?(?::[^}]+)?\}/g, (all, slash, name, mod) => {
			const v = params[name];
			if (v === void 0 || v === null) {
				if (mod === "?") return "";
				throw new Error(`route: не хватает параметра «${name}» для ${pattern}`);
			}
			used.add(name);
			return slash + (mod === "*" ? String(v).split("/").map(encodeURIComponent).join("/") : encodeURIComponent(v));
		});
		const rest = Object.keys(params).filter((k) => !used.has(k));
		if (rest.length) url += "?" + rest.map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(params[k])).join("&");
		return url;
	}
	// src/plugins/router/router.js
	function rewriteHistory(type) {
		const origin = window.history[type];
		return function() {
			const rv = origin.apply(this, arguments);
			const e = new Event(type);
			e.arguments = arguments;
			window.dispatchEvent(e);
			return rv;
		};
	}
	window.history.pushState = rewriteHistory("pushState");
	window.history.replaceState = rewriteHistory("replaceState");
	var Base = class {
		constructor(options) {
			this.events = [];
			const off = this.init(options);
			if (off) this.on("$destroy", off);
		}
		init() {}
		on(e, fn) {
			this.events.push({
				e,
				fn
			});
			return this;
		}
		off(e, fn) {
			this.events.forEach((item, i) => {
				if (item.e === e && item.fn === fn) this.events.splice(i, 1);
			});
			return this;
		}
		emit(e, ...args) {
			this.events.forEach((item) => {
				if (item.e === e) item.fn(...args);
			});
		}
		destroy() {
			this.emit("$destroy");
		}
	};
	var Navigation = class extends Base {
		init() {
			this.actionType = "";
			this.latestState = window.history.state;
			const onUrlChanged = (e) => {
				this.actionType = e.type;
				const currentState = this.latestState;
				this.latestState = window.history.state;
				const nextState = this.latestState;
				if (e.type === "popstate") {
					if (currentState?.prev === nextState) this.actionType = "back";
					else if (currentState?.next === nextState) this.actionType = "forward";
				}
				this.emit(this.actionType, window.location.href);
				this.emit("change", window.location.href);
			};
			const onBeforeUnload = (e) => {
				if (this.events.some((item) => item.e === "protect")) {
					let prevented = false;
					const resolve = () => void 0;
					const reject = () => prevented = true;
					this.emit("protect", resolve, reject);
					if (prevented) e.preventDefault();
				}
			};
			window.addEventListener("popstate", onUrlChanged);
			window.addEventListener("replaceState", onUrlChanged);
			window.addEventListener("pushState", onUrlChanged);
			window.addEventListener("beforeunload", onBeforeUnload);
			return () => {
				window.removeEventListener("popstate", onUrlChanged);
				window.removeEventListener("replaceState", onUrlChanged);
				window.removeEventListener("pushState", onUrlChanged);
				window.removeEventListener("beforeunload", onBeforeUnload);
			};
		}
		back() {
			window.history.back();
		}
		forward() {
			window.history.forward();
		}
		push(url) {
			if (window.location.href === url) return;
			const { state } = window.history;
			const next = {
				prev: state,
				url
			};
			window.history.pushState(next, null, url);
		}
		replace(url) {
			if (window.location.href === url) return;
			const { state } = window.history;
			const next = {
				prev: state?.prev?.state,
				url
			};
			window.history.replaceState(next, null, url);
		}
		open(url) {
			window.open(url);
		}
	};
	const navigation = new Navigation();
	let activeRouter = null;
	const fill = (tpl, params) => tpl.replace(/\{(\w+)\}/g, (_, k) => encodeURIComponent(params[k] ?? ""));
	var Router = class extends Base {
		init(options) {
			this.options = options;
			this.routes = {};
			const table = options.routes || {};
			Object.keys(table).forEach((name) => {
				const r = table[name];
				this.routes[name] = typeof r === "string" ? { path: r } : r;
			});
			this.extra = /* @__PURE__ */ new Set();
			this.url = this.getUrl();
			const onChange = () => {
				const { baseUri = "" } = options;
				const url = this.getUrl();
				const prev = this.url;
				this.url = url;
				if (prev === url) return;
				if (baseUri && url.indexOf(baseUri) !== 0) return;
				this.emit("change", url);
			};
			navigation.on("change", onChange);
			return () => navigation.off("change", onChange);
		}
		navigate(type, to) {
			if (this.options.mode === "history") navigation[type](to);
			else {
				const { pathname, search = "" } = window.location;
				navigation[type](pathname + search + "#" + to);
			}
		}
		getUrl() {
			const { hash, href, origin } = window.location;
			if (this.options.mode === "history") return href.replace(origin, "");
			return hash.replace("#", "") || "/";
		}
		getLocation() {
			const [pathname, search = ""] = this.getUrl().split("?");
			const query = {};
			search.split("&").filter(Boolean).forEach((item) => {
				const [k, v = ""] = item.split("=");
				query[decodeURIComponent(k)] = decodeURIComponent(v);
			});
			return {
				pathname,
				search,
				query
			};
		}
		setParams(params) {
			const { pathname, query } = this.getLocation();
			const next = {
				...query,
				...params
			};
			const search = Object.keys(next).map((k) => next[k] === void 0 ? k : encodeURIComponent(k) + "=" + encodeURIComponent(next[k])).join("&");
			this.navigate("push", pathname + (search ? "?" + search : ""));
		}
		pattern(ref) {
			return this.routes[ref] ? this.routes[ref].path : ref;
		}
		register(pattern) {
			if (!Object.values(this.routes).some((r) => r.path === pattern)) this.extra.add(pattern);
		}
		matchPath(pathname) {
			for (const name of Object.keys(this.routes)) {
				const params = matchRoute(this.routes[name].path, pathname);
				if (params) return {
					name,
					route: this.routes[name],
					params
				};
			}
			for (const pattern of this.extra) {
				const params = matchRoute(pattern, pathname);
				if (params) return {
					name: null,
					route: { path: pattern },
					params
				};
			}
			return {
				name: null,
				route: null,
				params: {}
			};
		}
		match() {
			return this.matchPath(this.getLocation().pathname);
		}
		isMatch(ref) {
			return matchRoute(this.pattern(ref), this.getLocation().pathname) !== null;
		}
		path(ref, params) {
			return buildRoute(this.pattern(ref), params);
		}
		href(path) {
			return this.options.mode === "history" ? path : "#" + path;
		}
		url2(ref, params) {
			return this.href(this.path(ref, params));
		}
		go(ref, params, type = "push") {
			this.navigate(type, this.path(ref, params));
		}
		prefetchPath(path) {
			const hit = this.matchPath(path.split("?")[0]);
			if (!hit.route) return;
			const { component: url, data } = hit.route;
			if (url) preloadComponent(url);
			const list = typeof data === "function" ? data(hit.params) : data;
			[].concat(list || []).forEach((u) => $wire.prefetch(fill(u, hit.params)));
		}
	};
	function route(ref, params) {
		return activeRouter.url2(ref, params);
	}
	directive("w-route", function($el, attrs) {
		const router = activeRouter;
		if (!router) throw new Error("Wex: подключите createRouter() через .plugin(...)");
		let pattern = attrs["w-route"].trim();
		if (/^(['"]).*\1$/.test(pattern)) pattern = pattern.slice(1, -1);
		router.register(pattern);
		if (!router.isMatch(pattern)) return `<!-- ${getNodeName($el[0])} w-route="${pattern.replace(/--/g, "- -")}" (hidden) -->`;
	}, null, 100);
	component("Link", function($el, attrs, slot) {
		const router = activeRouter;
		const ref = attrs[":to"] ? this.scope.parse(attrs[":to"]) : attrs.to;
		const params = attrs[":params"] ? this.scope.parse(attrs[":params"]) : {};
		const path = router.path(ref, params);
		const a = document.createElement("a");
		Object.keys(attrs).forEach((k) => {
			if (k === "to" || k[0] === ":" || k[0] === "@") return;
			a.setAttribute(k, attrs[k]);
		});
		a.setAttribute("href", router.href(path));
		a.setAttribute("data-wex-link", path);
		slot().forEach((n) => a.appendChild(n));
		return a;
	}, function($el) {
		const a = $el[0];
		const path = a && a.getAttribute && a.getAttribute("data-wex-link");
		if (!path) return;
		const router = activeRouter;
		let timer = null;
		const warm = () => router.prefetchPath(path);
		const enter = () => {
			clearTimeout(timer);
			timer = setTimeout(warm, 65);
		};
		const leave = () => clearTimeout(timer);
		const click = (e) => {
			if (router.options.mode !== "history") return;
			if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || a.target) return;
			e.preventDefault();
			router.navigate("push", path);
		};
		a.addEventListener("mouseenter", enter);
		a.addEventListener("mouseleave", leave);
		a.addEventListener("touchstart", warm, { passive: true });
		a.addEventListener("focus", warm);
		a.addEventListener("click", click);
		return () => {
			clearTimeout(timer);
			a.removeEventListener("mouseenter", enter);
			a.removeEventListener("mouseleave", leave);
			a.removeEventListener("touchstart", warm);
			a.removeEventListener("focus", warm);
			a.removeEventListener("click", click);
		};
	});
	function createRouter(options = {}) {
		const router = new Router(options);
		return function() {
			const { view } = this;
			activeRouter = router;
			const $route = {};
			const def = (key, get) => Object.defineProperty($route, key, {
				get,
				enumerable: true
			});
			def("name", () => router.match().name);
			def("params", () => router.match().params);
			def("query", () => router.getLocation().query);
			def("path", () => router.getLocation().pathname);
			Object.defineProperty($route, "url", {
				value: (ref, p) => router.url2(ref, p),
				enumerable: false
			});
			const routerChange = () => {
				view.emit("$route", router.getUrl());
				view.update(true);
			};
			return {
				$init: (state) => {
					view.$router = router;
					state.$route = $route;
					router.on("change", routerChange);
				},
				$destroy: () => {
					router.off("change", routerChange);
					router.destroy();
				},
				$clone: (state, clonedView) => {
					clonedView.$router = router;
				}
			};
		};
	}
	// src/lazy.js
	const cfg = {
		margin: "200px",
		timeout: 15e3
	};
	function findScroller(el, selector) {
		if (selector) return document.querySelector(selector);
		for (let n = el.parentElement; n && n !== document.body; n = n.parentElement) {
			const o = getComputedStyle(n).overflowY;
			if (o === "auto" || o === "scroll" || o === "overlay") return n;
		}
		return null;
	}
	function pickTarget(el, dir) {
		const edge = (n) => dir === "up" ? n.firstElementChild : n.lastElementChild;
		let cur = edge(el);
		while (cur && getComputedStyle(cur).display === "contents") {
			const next = edge(cur);
			if (!next) return el;
			cur = next;
		}
		return cur || el;
	}
	function makeLazy(el, o) {
		const scroller = findScroller(el, o.root);
		const scrollEl = scroller || document.scrollingElement || document.documentElement;
		if (o.dir === "up") scrollEl.style.overflowAnchor = "none";
		const lz = {
			key: o.key,
			view: o.view,
			busy: false,
			ended: false,
			finished: false,
			page: 0,
			lastCount: -1,
			stall: 0,
			restore: null,
			timer: null,
			rearm: null
		};
		lz.io = new IntersectionObserver((entries) => {
			if (!el.isConnected) return lz.destroy();
			if (entries.some((e) => e.isIntersecting)) trigger();
		}, {
			root: scroller,
			rootMargin: o.margin || cfg.margin
		});
		function settle() {
			const r = lz.restore;
			if (!r || !lz.finished) return;
			lz.restore = null;
			scrollEl.scrollTop = r.top + (scrollEl.scrollHeight - r.height);
		}
		function release() {
			if (!lz.busy) return;
			clearTimeout(lz.timer);
			lz.busy = false;
			lz.finished = true;
			clearTimeout(lz.rearm);
			lz.rearm = setTimeout(() => {
				settle();
				if (el.isConnected && !lz.ended) lz.watch();
			}, 60);
		}
		function end() {
			release();
			lz.ended = true;
			lz.io.disconnect();
		}
		function fail(ms = 3e3) {
			clearTimeout(lz.timer);
			lz.timer = setTimeout(release, ms);
		}
		function trigger() {
			if (lz.busy || lz.ended || !el.isConnected) return;
			const count = el.children.length;
			if (lz.page > 0 && count === lz.lastCount) {
				if (++lz.stall >= 2) {
					lz.ended = true;
					lz.io.disconnect();
					console.warn("Wex w-lazy: список не вырос после двух подгрузок, подгрузка остановлена. Вызовите lazy.end(), когда данных больше нет.", el);
					return;
				}
			} else lz.stall = 0;
			lz.lastCount = count;
			lz.busy = true;
			lz.finished = false;
			lz.page++;
			lz.restore = o.dir === "up" ? {
				height: scrollEl.scrollHeight,
				top: scrollEl.scrollTop
			} : null;
			lz.timer = setTimeout(release, cfg.timeout);
			lz.view.emit("$lazy", {
				el,
				direction: o.dir,
				page: lz.page,
				offset: count,
				done: release,
				end,
				fail
			});
		}
		lz.watch = () => {
			if (lz.ended) return;
			lz.io.disconnect();
			lz.io.observe(pickTarget(el, o.dir));
		};
		lz.settle = settle;
		lz.destroy = () => {
			clearTimeout(lz.timer);
			clearTimeout(lz.rearm);
			lz.io.disconnect();
			delete el.__wLazy;
		};
		return lz;
	}
	directive("w-lazy", null, function($el, attrs) {
		const el = $el[0];
		const { view, scope } = this;
		const key = attrs["w-lazy-key"] ? scope.parse(attrs["w-lazy-key"]) : void 0;
		let lz = el.__wLazy;
		if (lz && lz.key !== key) {
			lz.destroy();
			lz = null;
		}
		if (!lz) lz = el.__wLazy = makeLazy(el, {
			dir: (attrs["w-lazy"] || "").trim() === "up" ? "up" : "down",
			margin: attrs["w-lazy-margin"],
			root: attrs["w-lazy-root"],
			key,
			view
		});
		lz.view = view;
		lz.settle();
		lz.watch();
	});
	function createLazy(options = {}) {
		Object.assign(cfg, options);
		return function() {};
	}
	// src/prefetch.js
	const unquote = (s) => String(s).trim().replace(/^(['"])(.*)\1$/, "$2");
	const PATH = /^[a-zA-Z_$][\w$]*(\.[\w$]+)*$/;
	directive("w-prefetch", null, function($el, attrs) {
		const { scope, view } = this;
		const el = $el[0];
		const raw = attrs["w-prefetch"];
		const ctx = {
			view,
			el,
			attr: "w-prefetch",
			expr: raw,
			scope
		};
		el.__wPrefetch = true;
		const wire = globalThis.$wire;
		if (!wire || typeof wire.prefetch !== "function") {
			report("w-prefetch: $wire или $wire.prefetch недоступен", {
				...ctx,
				level: "error",
				hint: "Проверьте, что в wire есть wire.prefetch = prefetch и $wire доступен глобально"
			});
			return;
		}
		const url = unquote(scope.interpolate(raw || ""));
		if (!url || url === "undefined" || url === "null" || url.indexOf("{{") !== -1) {
			report(`w-prefetch: некорректный URL ${JSON.stringify(url)}`, {
				...ctx,
				level: "error",
				hint: "Ожидается строка вида w-prefetch=\"/api/posts.json\" или w-prefetch=\"/api/posts/{{ id }}.json\""
			});
			return;
		}
		let path = null;
		const rawTo = attrs["w-to"];
		if (rawTo !== void 0) {
			const toCtx = {
				...ctx,
				attr: "w-to",
				expr: rawTo
			};
			path = unquote(scope.interpolate(rawTo)).replace(/^state\./, "");
			if (!PATH.test(path)) {
				report(`w-to: некорректный путь ${JSON.stringify(path)}`, {
					...toCtx,
					level: "error",
					hint: "Ожидается имя переменной из state: w-to=\"posts\" или w-to=\"data.posts\""
				});
				path = null;
			} else {
				let current;
				try {
					current = scope.parse(path);
				} catch (e) {
					current = void 0;
				}
				if (current === void 0) report(`w-to: «${path}» не найден в state`, {
					...toCtx,
					scope,
					hint: "Объявите переменную в .state({ " + path.split(".")[0] + ": [] }), иначе запись может быть нереактивной"
				});
			}
		}
		const prefetch = () => wire.prefetch(url);
		const load = () => {
			wire.get(url).done((data) => {
				if (data === null || data === void 0) report(`w-to: ${url} вернул ${data}`, {
					...ctx,
					attr: "w-to",
					expr: rawTo,
					scope
				});
				try {
					scope.assign(path, data);
				} catch (e) {
					report(`w-to: не удалось записать в «${path}»: ${e.message}`, {
						...ctx,
						attr: "w-to",
						expr: rawTo,
						scope,
						level: "error"
					});
				}
			}).fail((xhr, status) => {
				report(`w-prefetch: ${url} → ${xhr && xhr.status || "?"} ${status}`, {
					...ctx,
					level: "error",
					hint: "404: проверьте путь и регистр имени файла; parsererror: проверьте, что JSON валидный"
				});
			});
		};
		$el.on("mouseenter.wprefetch focus.wprefetch touchstart.wprefetch", prefetch);
		if (path) $el.on("click.wprefetch", load);
		return () => {
			$el.off(".wprefetch");
			delete el.__wPrefetch;
		};
	});
	directive("w-to", null, function($el, attrs) {
		if (!$el[0].__wPrefetch) report("w-to без w-prefetch: атрибут ни на что не влияет", {
			view: this.view,
			el: $el[0],
			attr: "w-to",
			expr: attrs["w-to"],
			level: "error",
			hint: "Добавьте w-prefetch=\"/url.json\" на тот же элемент"
		});
	});
	// src/plugins/modal/modal.js
	/**
	* modal.js
	* Bootstrap 5 modal integration — часть Wex-стека.
	*
	* Импортируется как side-effect в index.js:
	*   import './modal.js'
	*
	* Не использует window.$ напрямую — регистрирует директиву через
	* тот же directive() что и весь стек, а $.fn.modal патчится внутри
	* useJQuery() через хук который мы сюда экспортируем.
	*/
	function setupModal($) {
		if (!$) return;
		$.fn.modal = function(action, options) {
			return this.each(function() {
				const el = this;
				const bs = window.bootstrap;
				if (!bs) {
					console.warn("[wex-modal] Bootstrap 5 не найден — $.fn.modal не работает");
					return;
				}
				const getInstance = () => bs.Modal.getInstance(el);
				const getOrCreate = (opts) => getInstance() || new bs.Modal(el, opts || {});
				if (typeof action === "object" || action === void 0) {
					getOrCreate(action);
					return;
				}
				switch (action) {
					case "show":
						getOrCreate(options).show();
						break;
					case "hide":
						getInstance()?.hide();
						break;
					case "toggle":
						el.classList.contains("show") ? getInstance()?.hide() : getOrCreate(options).show();
						break;
					case "handleUpdate":
						getInstance()?.handleUpdate();
						break;
					case "dispose":
						getInstance()?.dispose();
						break;
					default: console.warn(`[wex-modal] Неизвестный action: "${action}"`);
				}
			});
		};
	}
	directive("w-modal", null, function($el, attrs) {
		const modalKey = attrs["w-modal"];
		const { scope, view } = this;
		const rawState = scope.data;
		if (!rawState || !("modal" in rawState)) {
			console.error(`[wex-modal] Бро, всё хорошо — ты просто кое-что забыл!\nДобавь поле "modal" в стейт и внутри него ключ "${modalKey}":\n\n  .state({\n    modal: {\n      ${modalKey}: false,\n    }\n  })`);
			return;
		}
		if (!(modalKey in rawState.modal)) {
			console.error(`[wex-modal] Бро, всё хорошо — ты просто кое-что забыл!\nПоле "modal" есть, но в нём нет ключа "${modalKey}":\n\n  .state({\n    modal: {\n      ${modalKey}: false,  // ← добавь это\n    }\n  })`);
			return;
		}
		const getModalEl = () => document.getElementById(modalKey);
		const getInstance = () => {
			const bs = window.bootstrap;
			if (!bs) return null;
			const el = getModalEl();
			return el ? bs.Modal.getInstance(el) || new bs.Modal(el) : null;
		};
		const selector = `[w-modal="${modalKey}"]`;
		const onClick = (state) => {
			state.modal[modalKey] = !state.modal[modalKey];
		};
		view.on("click", selector, onClick);
		const syncToBootstrap = () => {
			const value = rawState.modal[modalKey];
			const instance = getInstance();
			if (!instance) return;
			const isOpen = getModalEl()?.classList.contains("show");
			if (value && !isOpen) instance.show();
			if (!value && isOpen) instance.hide();
		};
		syncToBootstrap();
		const modalEl = getModalEl();
		const onBsShow = () => {
			rawState.modal[modalKey] = true;
			view.emit("$modalShow", modalKey);
		};
		const onBsShown = () => {
			view.emit("$modalShown", modalKey);
		};
		const onBsHide = () => {
			view.emit("$modalHide", modalKey);
		};
		const onBsHidden = () => {
			rawState.modal[modalKey] = false;
			view.emit("$modalHidden", modalKey);
		};
		if (modalEl) {
			modalEl.addEventListener("show.bs.modal", onBsShow);
			modalEl.addEventListener("shown.bs.modal", onBsShown);
			modalEl.addEventListener("hide.bs.modal", onBsHide);
			modalEl.addEventListener("hidden.bs.modal", onBsHidden);
		}
		return () => {
			view.off("click", selector, onClick);
			if (modalEl) {
				modalEl.removeEventListener("show.bs.modal", onBsShow);
				modalEl.removeEventListener("shown.bs.modal", onBsShown);
				modalEl.removeEventListener("hide.bs.modal", onBsHide);
				modalEl.removeEventListener("hidden.bs.modal", onBsHidden);
			}
		};
	});
	// src/index.js
	if (typeof jQuery !== "undefined") {
		useJQuery(jQuery);
		setupModal(jQuery);
	}
	if (typeof window !== "undefined") window.$wire = $wire;
	exports.$wire = $wire;
	exports.View = View;
	exports.component = component;
	exports.createAsyncComponent = createAsyncComponent;
	exports.createLazy = createLazy;
	exports.createRouter = createRouter;
	exports.createWire = createWire;
	exports.directive = directive;
	exports.filter = filter;
	exports.route = route;
	exports.shareState = shareState;
	exports.useJQuery = useJQuery;
});
