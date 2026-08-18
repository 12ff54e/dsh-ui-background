window.__ModuleLoader__.load({
	id: "dsh-ui-background",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");
		let react_jsx_runtime = require("react/jsx-runtime");
		let _deepseek_ai_dsh_client_runtime_client = require("@deepseek-ai/dsh-client-runtime/client");
		//#region ../node_modules/.pnpm/clsx@2.1.1/node_modules/clsx/dist/clsx.mjs
		function r(e) {
			var t, f, n = "";
			if ("string" == typeof e || "number" == typeof e) n += e;
			else if ("object" == typeof e) if (Array.isArray(e)) {
				var o = e.length;
				for (t = 0; t < o; t++) e[t] && (f = r(e[t])) && (n && (n += " "), n += f);
			} else for (f in e) e[f] && (n && (n += " "), n += f);
			return n;
		}
		function clsx() {
			for (var e, t, f = 0, n = "", o = arguments.length; f < o; f++) (e = arguments[f]) && (t = r(e)) && (n && (n += " "), n += t);
			return n;
		}
		//#endregion
		//#region ../vendor/cosmokit/lib/index.js
		/** Return true when a value is `null` or `undefined`. */
		function isNullable(value) {
			return value === null || value === void 0;
		}
		/** Return true for non-array object values. */
		function isPlainObject(data) {
			return data && typeof data === "object" && !Array.isArray(data);
		}
		/** Filter object entries and return a new object. */
		function filterKeys(object, filter) {
			return Object.fromEntries(Object.entries(object).filter(([key, value]) => filter(key, value)));
		}
		/** Map object values while preserving the original key set. */
		function mapValues(object, transform) {
			return Object.fromEntries(Object.entries(object).map(([key, value]) => [key, transform(value, key)]));
		}
		/** Pick selected keys from an object, optionally including `undefined` values. */
		function pick(source, keys, forced) {
			if (!keys) return { ...source };
			const result = {};
			for (const key of keys) if (forced || source[key] !== void 0) result[key] = source[key];
			return result;
		}
		/** Test values using `instanceof` with a `toStringTag` fallback. */
		function is(type, value) {
			if (arguments.length === 1) return (value) => is(type, value);
			return type in globalThis && value instanceof globalThis[type] || Object.prototype.toString.call(value).slice(8, -1) === type;
		}
		function isArrayBufferLike(value) {
			return is("ArrayBuffer", value) || is("SharedArrayBuffer", value);
		}
		function isArrayBufferSource(value) {
			return isArrayBufferLike(value) || ArrayBuffer.isView(value);
		}
		/** Binary source detection and base64/hex conversion helpers. */
		var Binary;
		(function(Binary) {
			Binary.is = isArrayBufferLike;
			Binary.isSource = isArrayBufferSource;
			function fromSource(source) {
				if (ArrayBuffer.isView(source)) return source.buffer.slice(source.byteOffset, source.byteOffset + source.byteLength);
				else return source;
			}
			Binary.fromSource = fromSource;
			function toBase64(source) {
				source = fromSource(source);
				if (typeof Buffer !== "undefined") return Buffer.from(source).toString("base64");
				let binary = "";
				const bytes = new Uint8Array(source);
				for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
				return btoa(binary);
			}
			Binary.toBase64 = toBase64;
			function fromBase64(source) {
				if (typeof Buffer !== "undefined") return fromSource(Buffer.from(source, "base64"));
				return Uint8Array.from(atob(source), (c) => c.charCodeAt(0));
			}
			Binary.fromBase64 = fromBase64;
			function toHex(source) {
				source = fromSource(source);
				if (typeof Buffer !== "undefined") return Buffer.from(source).toString("hex");
				return Array.from(new Uint8Array(source), (byte) => byte.toString(16).padStart(2, "0")).join("");
			}
			Binary.toHex = toHex;
			function fromHex(source) {
				if (typeof Buffer !== "undefined") return fromSource(Buffer.from(source, "hex"));
				const hex = source.length % 2 === 0 ? source : source.slice(0, source.length - 1);
				const buffer = [];
				for (let i = 0; i < hex.length; i += 2) buffer.push(parseInt(`${hex[i]}${hex[i + 1]}`, 16));
				return Uint8Array.from(buffer).buffer;
			}
			Binary.fromHex = fromHex;
		})(Binary || (Binary = {}));
		Binary.fromBase64;
		Binary.toBase64;
		Binary.fromHex;
		Binary.toHex;
		/** Deep-clone common JavaScript values while preserving prototypes and cycles. */
		function clone(source, refs = /* @__PURE__ */ new Map()) {
			if (!source || typeof source !== "object") return source;
			if (is("Date", source)) return new Date(source.valueOf());
			if (is("RegExp", source)) return new RegExp(source.source, source.flags);
			if (isArrayBufferLike(source)) return source.slice(0);
			if (ArrayBuffer.isView(source)) return source.buffer.slice(source.byteOffset, source.byteOffset + source.byteLength);
			const cached = refs.get(source);
			if (cached) return cached;
			if (Array.isArray(source)) {
				const result = [];
				refs.set(source, result);
				source.forEach((value, index) => {
					result[index] = Reflect.apply(clone, null, [value, refs]);
				});
				return result;
			}
			const result = Object.create(Object.getPrototypeOf(source));
			refs.set(source, result);
			for (const key of Reflect.ownKeys(source)) {
				const descriptor = { ...Reflect.getOwnPropertyDescriptor(source, key) };
				if ("value" in descriptor) descriptor.value = Reflect.apply(clone, null, [descriptor.value, refs]);
				Reflect.defineProperty(result, key, descriptor);
			}
			return result;
		}
		/** Deeply compare arrays, dates, regexps, buffers, and plain object fields. */
		function deepEqual(a, b, strict) {
			if (a === b) return true;
			if (!strict && isNullable(a) && isNullable(b)) return true;
			if (typeof a !== typeof b) return false;
			if (typeof a !== "object") return false;
			if (!a || !b) return false;
			function check(test, then) {
				return test(a) ? test(b) ? then(a, b) : false : test(b) ? false : void 0;
			}
			return check(Array.isArray, (a, b) => a.length === b.length && a.every((item, index) => deepEqual(item, b[index]))) ?? check(is("Date"), (a, b) => a.valueOf() === b.valueOf()) ?? check(is("RegExp"), (a, b) => a.source === b.source && a.flags === b.flags) ?? check(isArrayBufferLike, (a, b) => {
				if (a.byteLength !== b.byteLength) return false;
				const viewA = new Uint8Array(a);
				const viewB = new Uint8Array(b);
				for (let i = 0; i < viewA.length; i++) if (viewA[i] !== viewB[i]) return false;
				return true;
			}) ?? Object.keys({
				...a,
				...b
			}).every((key) => deepEqual(a[key], b[key], strict));
		}
		/** Time constants plus parsing and formatting helpers. */
		var Time;
		(function(Time) {
			Time.millisecond = 1;
			Time.second = 1e3;
			Time.minute = Time.second * 60;
			Time.hour = Time.minute * 60;
			Time.day = Time.hour * 24;
			Time.week = Time.day * 7;
			let timezoneOffset = (/* @__PURE__ */ new Date()).getTimezoneOffset();
			function setTimezoneOffset(offset) {
				timezoneOffset = offset;
			}
			Time.setTimezoneOffset = setTimezoneOffset;
			function getTimezoneOffset() {
				return timezoneOffset;
			}
			Time.getTimezoneOffset = getTimezoneOffset;
			function getDateNumber(date = /* @__PURE__ */ new Date(), offset) {
				if (typeof date === "number") date = new Date(date);
				if (offset === void 0) offset = timezoneOffset;
				return Math.floor((date.valueOf() / Time.minute - offset) / 1440);
			}
			Time.getDateNumber = getDateNumber;
			function fromDateNumber(value, offset) {
				const date = new Date(value * Time.day);
				if (offset === void 0) offset = timezoneOffset;
				return new Date(+date + offset * Time.minute);
			}
			Time.fromDateNumber = fromDateNumber;
			const numeric = /\d+(?:\.\d+)?/.source;
			const timeRegExp = new RegExp(`^${[
				"w(?:eek(?:s)?)?",
				"d(?:ay(?:s)?)?",
				"h(?:our(?:s)?)?",
				"m(?:in(?:ute)?(?:s)?)?",
				"s(?:ec(?:ond)?(?:s)?)?"
			].map((unit) => `(${numeric}${unit})?`).join("")}$`);
			function parseTime(source) {
				const capture = timeRegExp.exec(source);
				if (!capture) return 0;
				return (parseFloat(capture[1]) * Time.week || 0) + (parseFloat(capture[2]) * Time.day || 0) + (parseFloat(capture[3]) * Time.hour || 0) + (parseFloat(capture[4]) * Time.minute || 0) + (parseFloat(capture[5]) * Time.second || 0);
			}
			Time.parseTime = parseTime;
			function parseDate(date) {
				const parsed = parseTime(date);
				if (parsed) date = Date.now() + parsed;
				else if (/^\d{1,2}(:\d{1,2}){1,2}$/.test(date)) date = `${(/* @__PURE__ */ new Date()).toLocaleDateString()}-${date}`;
				else if (/^\d{1,2}-\d{1,2}-\d{1,2}(:\d{1,2}){1,2}$/.test(date)) date = `${(/* @__PURE__ */ new Date()).getFullYear()}-${date}`;
				return date ? new Date(date) : /* @__PURE__ */ new Date();
			}
			Time.parseDate = parseDate;
			function format(ms) {
				const abs = Math.abs(ms);
				if (abs >= Time.day - Time.hour / 2) return Math.round(ms / Time.day) + "d";
				else if (abs >= Time.hour - Time.minute / 2) return Math.round(ms / Time.hour) + "h";
				else if (abs >= Time.minute - Time.second / 2) return Math.round(ms / Time.minute) + "m";
				else if (abs >= Time.second) return Math.round(ms / Time.second) + "s";
				return ms + "ms";
			}
			Time.format = format;
			function toDigits(source, length = 2) {
				return source.toString().padStart(length, "0");
			}
			Time.toDigits = toDigits;
			function template(template, time = /* @__PURE__ */ new Date()) {
				return template.replace("yyyy", time.getFullYear().toString()).replace("yy", time.getFullYear().toString().slice(2)).replace("MM", toDigits(time.getMonth() + 1)).replace("dd", toDigits(time.getDate())).replace("hh", toDigits(time.getHours())).replace("mm", toDigits(time.getMinutes())).replace("ss", toDigits(time.getSeconds())).replace("SSS", toDigits(time.getMilliseconds(), 3));
			}
			Time.template = template;
		})(Time || (Time = {}));
		//#endregion
		//#region ../vendor/schemastery/lib/index.mjs
		const kSchema = Symbol.for("schemastery");
		const kValidationError = Symbol.for("ValidationError");
		globalThis.__schemastery_index__ ??= 0;
		globalThis.__schemastery_refs__ = void 0;
		var ValidationError = class extends TypeError {
			options;
			name = "ValidationError";
			constructor(message, options) {
				let prefix = "$";
				for (const segment of options.path || []) if (typeof segment === "string") prefix += "." + segment;
				else if (typeof segment === "number") prefix += "[" + segment + "]";
				else if (typeof segment === "symbol") prefix += `[Symbol(${segment.toString()})]`;
				if (prefix.startsWith(".")) prefix = prefix.slice(1);
				super((prefix === "$" ? "" : `${prefix} `) + message);
				this.options = options;
			}
			static is(error) {
				return !!error?.[kValidationError];
			}
		};
		Object.defineProperty(ValidationError.prototype, kValidationError, { value: true });
		const Schema = function(options) {
			const schema = function(data, options = {}) {
				return Schema.resolve(data, schema, options)[0];
			};
			if (options.refs) {
				const refs = mapValues(options.refs, (options) => new Schema(options));
				const getRef = (uid) => refs[uid];
				for (const key in refs) {
					const options = refs[key];
					options.sKey = getRef(options.sKey);
					options.inner = getRef(options.inner);
					options.list = options.list && options.list.map(getRef);
					options.dict = options.dict && mapValues(options.dict, getRef);
				}
				return refs[options.uid];
			}
			Object.assign(schema, options);
			if (typeof schema.callback === "string") try {
				schema.callback = new Function("return " + schema.callback)();
			} catch {}
			Object.defineProperty(schema, "uid", { value: globalThis.__schemastery_index__++ });
			Object.setPrototypeOf(schema, Schema.prototype);
			schema.meta ||= {};
			schema.toString = schema.toString.bind(schema);
			return schema;
		};
		Schema.prototype = Object.create(Function.prototype);
		Schema.prototype[kSchema] = true;
		Object.defineProperty(Schema.prototype, "~standard", { get() {
			return {
				version: 1,
				vendor: "schemastery",
				validate: (value) => {
					try {
						return { value: Schema.resolve(value, this, {})[0] };
					} catch (error) {
						if (ValidationError.is(error)) return { issues: [{
							message: error.message,
							path: error.options.path
						}] };
						throw error;
					}
				}
			};
		} });
		Schema.ValidationError = ValidationError;
		Schema.prototype.toJSON = function toJSON() {
			if (globalThis.__schemastery_refs__) {
				globalThis.__schemastery_refs__[this.uid] ??= JSON.parse(JSON.stringify({ ...this }));
				return this.uid;
			}
			globalThis.__schemastery_refs__ = { [this.uid]: { ...this } };
			globalThis.__schemastery_refs__[this.uid] = JSON.parse(JSON.stringify({ ...this }));
			const result = {
				uid: this.uid,
				refs: globalThis.__schemastery_refs__
			};
			globalThis.__schemastery_refs__ = void 0;
			return result;
		};
		Schema.prototype.set = function set(key, value) {
			this.dict[key] = value;
			return this;
		};
		Schema.prototype.push = function push(value) {
			this.list.push(value);
			return this;
		};
		function mergeDesc(original, messages) {
			const result = typeof original === "string" ? { "": original } : { ...original };
			for (const locale in messages) {
				const value = messages[locale];
				if (value?.$description || value?.$desc) result[locale] = value.$description || value.$desc;
				else if (typeof value === "string") result[locale] = value;
			}
			return result;
		}
		function getInner(value) {
			return value?.$value ?? value?.$inner;
		}
		function extractKeys(data) {
			return filterKeys(data ?? {}, (key) => !key.startsWith("$"));
		}
		Schema.prototype.i18n = function i18n(messages) {
			const schema = Schema(this);
			const desc = mergeDesc(schema.meta.description, messages);
			if (Object.keys(desc).length) schema.meta.description = desc;
			if (schema.dict) schema.dict = mapValues(schema.dict, (inner, key) => {
				return inner.i18n(mapValues(messages, (data) => getInner(data)?.[key] ?? data?.[key]));
			});
			if (schema.list) schema.list = schema.list.map((inner, index) => {
				return inner.i18n(mapValues(messages, (data = {}) => {
					if (Array.isArray(getInner(data))) return getInner(data)[index];
					if (Array.isArray(data)) return data[index];
					return extractKeys(data);
				}));
			});
			if (schema.inner) schema.inner = schema.inner.i18n(mapValues(messages, (data) => {
				if (getInner(data)) return getInner(data);
				return extractKeys(data);
			}));
			if (schema.sKey) schema.sKey = schema.sKey.i18n(mapValues(messages, (data) => data?.$key));
			return schema;
		};
		Schema.prototype.extra = function extra(key, value) {
			const schema = Schema(this);
			schema.meta = {
				...schema.meta,
				[key]: value
			};
			return schema;
		};
		for (const key of [
			"required",
			"disabled",
			"collapse",
			"hidden",
			"loose"
		]) Object.assign(Schema.prototype, { [key](value = true) {
			const schema = Schema(this);
			schema.meta = {
				...schema.meta,
				[key]: value
			};
			return schema;
		} });
		Schema.prototype.deprecated = function deprecated() {
			const schema = Schema(this);
			schema.meta.badges ||= [];
			schema.meta.badges.push({
				text: "deprecated",
				type: "danger"
			});
			return schema;
		};
		Schema.prototype.experimental = function experimental() {
			const schema = Schema(this);
			schema.meta.badges ||= [];
			schema.meta.badges.push({
				text: "experimental",
				type: "warning"
			});
			return schema;
		};
		Schema.prototype.pattern = function pattern(regexp) {
			const schema = Schema(this);
			const pattern = pick(regexp, ["source", "flags"]);
			schema.meta = {
				...schema.meta,
				pattern
			};
			return schema;
		};
		Schema.prototype.simplify = function simplify(value) {
			if (deepEqual(value, this.meta.default, this.type === "dict")) return null;
			if (isNullable(value)) return value;
			if (this.type === "object" || this.type === "dict") {
				const result = {};
				for (const key in value) {
					const item = (this.type === "object" ? this.dict[key] : this.inner)?.simplify(value[key]);
					if (this.type === "dict" || !isNullable(item)) result[key] = item;
				}
				if (deepEqual(result, this.meta.default, this.type === "dict")) return null;
				return result;
			} else if (this.type === "array" || this.type === "tuple") {
				const result = [];
				value.forEach((value, index) => {
					const schema = this.type === "array" ? this.inner : this.list[index];
					const item = schema ? schema.simplify(value) : value;
					result.push(item);
				});
				return result;
			} else if (this.type === "intersect") {
				const result = {};
				for (const item of this.list) Object.assign(result, item.simplify(value));
				return result;
			} else if (this.type === "union") for (const schema of this.list) try {
				Schema.resolve(value, schema, {});
				return schema.simplify(value);
			} catch {}
			return value;
		};
		Schema.prototype.toString = function toString(inline) {
			return formatters[this.type]?.(this, inline) ?? `Schema<${this.type}>`;
		};
		Schema.prototype.role = function role(role, extra) {
			const schema = Schema(this);
			schema.meta = {
				...schema.meta,
				role,
				extra
			};
			return schema;
		};
		for (const key of [
			"default",
			"link",
			"comment",
			"description",
			"max",
			"min",
			"step"
		]) Object.assign(Schema.prototype, { [key](value) {
			const schema = Schema(this);
			schema.meta = {
				...schema.meta,
				[key]: value
			};
			return schema;
		} });
		const resolvers = {};
		Schema.extend = function extend(type, resolve) {
			resolvers[type] = resolve;
		};
		Schema.resolve = function resolve(data, schema, options = {}, strict = false) {
			if (!schema) return [data];
			if (options.ignore?.(data, schema)) return [data];
			if (isNullable(data) && schema.type !== "lazy") {
				if (schema.meta.required) throw new ValidationError(`missing required value`, options);
				let current = schema;
				let fallback = schema.meta.default;
				while (current?.type === "intersect" && isNullable(fallback)) {
					current = current.list[0];
					fallback = current?.meta.default;
				}
				if (isNullable(fallback)) return [data];
				data = clone(fallback);
			}
			const callback = resolvers[schema.type];
			if (!callback) throw new ValidationError(`unsupported type "${schema.type}"`, options);
			try {
				return callback(data, schema, options, strict);
			} catch (error) {
				if (!schema.meta.loose) throw error;
				return [schema.meta.default];
			}
		};
		Schema.from = function from(source) {
			if (isNullable(source)) return Schema.any();
			else if ([
				"string",
				"number",
				"boolean"
			].includes(typeof source)) return Schema.const(source).required();
			else if (source[kSchema]) return source;
			else if (typeof source === "function") switch (source) {
				case String: return Schema.string().required();
				case Number: return Schema.number().required();
				case Boolean: return Schema.boolean().required();
				case Function: return Schema.function().required();
				default: return Schema.is(source).required();
			}
			else throw new TypeError(`cannot infer schema from ${source}`);
		};
		Schema.lazy = function lazy(builder) {
			const toJSON = () => {
				if (!schema.inner[kSchema]) {
					schema.inner = schema.builder();
					schema.inner.meta = {
						...schema.meta,
						...schema.inner.meta
					};
				}
				return schema.inner.toJSON();
			};
			const schema = new Schema({
				type: "lazy",
				builder,
				inner: { toJSON }
			});
			return schema;
		};
		Schema.natural = function natural() {
			return Schema.number().step(1).min(0);
		};
		Schema.percent = function percent() {
			return Schema.number().step(.01).min(0).max(1).role("slider");
		};
		Schema.date = function date() {
			return Schema.union([Schema.is(Date), Schema.transform(Schema.string().role("datetime"), (value, options) => {
				const date = new Date(value);
				if (isNaN(+date)) throw new ValidationError(`invalid date "${value}"`, options);
				return date;
			}, true)]);
		};
		Schema.regExp = function regExp(flag = "") {
			return Schema.union([Schema.is(RegExp), Schema.transform(Schema.string().role("regexp", { flag }), (value, options) => {
				try {
					return new RegExp(value, flag);
				} catch (e) {
					throw new ValidationError(e.message, options);
				}
			}, true)]);
		};
		Schema.arrayBuffer = function arrayBuffer(encoding) {
			return Schema.union([
				Schema.is(ArrayBuffer),
				Schema.is(SharedArrayBuffer),
				Schema.transform(Schema.any(), (value, options) => {
					if (Binary.isSource(value)) return Binary.fromSource(value);
					throw new ValidationError(`expected ArrayBufferSource but got ${value}`, options);
				}, true),
				...encoding ? [Schema.transform(Schema.string(), (value, options) => {
					try {
						return encoding === "base64" ? Binary.fromBase64(value) : Binary.fromHex(value);
					} catch (e) {
						throw new ValidationError(e.message, options);
					}
				}, true)] : []
			]);
		};
		Schema.extend("lazy", (data, schema, options, strict) => {
			if (!schema.inner[kSchema]) {
				schema.inner = schema.builder();
				schema.inner.meta = {
					...schema.meta,
					...schema.inner.meta
				};
			}
			return Schema.resolve(data, schema.inner, options, strict);
		});
		Schema.extend("any", (data) => {
			return [data];
		});
		Schema.extend("never", (data, _, options) => {
			throw new ValidationError(`expected nullable but got ${data}`, options);
		});
		Schema.extend("const", (data, { value }, options) => {
			if (deepEqual(data, value)) return [value];
			throw new ValidationError(`expected ${value} but got ${data}`, options);
		});
		function checkWithinRange(data, meta, description, options, skipMin = false) {
			const { max = Infinity, min = -Infinity } = meta;
			if (data > max) throw new ValidationError(`expected ${description} <= ${max} but got ${data}`, options);
			if (data < min && !skipMin) throw new ValidationError(`expected ${description} >= ${min} but got ${data}`, options);
		}
		Schema.extend("string", (data, { meta }, options) => {
			if (typeof data !== "string") throw new ValidationError(`expected string but got ${data}`, options);
			if (meta.pattern) {
				const regexp = new RegExp(meta.pattern.source, meta.pattern.flags);
				if (!regexp.test(data)) throw new ValidationError(`expect string to match regexp ${regexp}`, options);
			}
			checkWithinRange(data.length, meta, "string length", options);
			return [data];
		});
		function decimalShift(data, digits) {
			const str = data.toString();
			if (str.includes("e")) return data * Math.pow(10, digits);
			const index = str.indexOf(".");
			if (index === -1) return data * Math.pow(10, digits);
			const frac = str.slice(index + 1);
			const integer = str.slice(0, index);
			if (frac.length <= digits) return +(integer + frac.padEnd(digits, "0"));
			return +(integer + frac.slice(0, digits) + "." + frac.slice(digits));
		}
		function isMultipleOf(data, min, step) {
			step = Math.abs(step);
			if (!/^\d+\.\d+$/.test(step.toString())) return (data - min) % step === 0;
			const index = step.toString().indexOf(".");
			const digits = step.toString().slice(index + 1).length;
			return Math.abs(decimalShift(data, digits) - decimalShift(min, digits)) % decimalShift(step, digits) === 0;
		}
		Schema.extend("number", (data, { meta }, options) => {
			if (typeof data !== "number") throw new ValidationError(`expected number but got ${data}`, options);
			checkWithinRange(data, meta, "number", options);
			const { step } = meta;
			if (step && !isMultipleOf(data, meta.min ?? 0, step)) throw new ValidationError(`expected number multiple of ${step} but got ${data}`, options);
			return [data];
		});
		Schema.extend("boolean", (data, _, options) => {
			if (typeof data === "boolean") return [data];
			throw new ValidationError(`expected boolean but got ${data}`, options);
		});
		Schema.extend("bitset", (data, { bits, meta }, options) => {
			let value = 0, keys = [];
			if (typeof data === "number") {
				value = data;
				for (const key in bits) if (data & bits[key]) keys.push(key);
			} else if (Array.isArray(data)) {
				keys = data;
				for (const key of keys) {
					if (typeof key !== "string") throw new ValidationError(`expected string but got ${key}`, options);
					if (key in bits) value |= bits[key];
				}
			} else throw new ValidationError(`expected number or array but got ${data}`, options);
			if (value === meta.default) return [value];
			return [value, keys];
		});
		Schema.extend("function", (data, _, options) => {
			if (typeof data === "function") return [data];
			throw new ValidationError(`expected function but got ${data}`, options);
		});
		Schema.extend("is", (data, { constructor }, options) => {
			if (typeof constructor === "function") {
				if (data instanceof constructor) return [data];
				throw new ValidationError(`expected ${constructor.name} but got ${data}`, options);
			} else {
				if (isNullable(data)) throw new ValidationError(`expected ${constructor} but got ${data}`, options);
				let prototype = Object.getPrototypeOf(data);
				while (prototype) {
					if (prototype.constructor?.name === constructor) return [data];
					prototype = Object.getPrototypeOf(prototype);
				}
				throw new ValidationError(`expected ${constructor} but got ${data}`, options);
			}
		});
		function property(data, key, schema, options) {
			try {
				const [value, adapted] = Schema.resolve(data[key], schema, {
					...options,
					path: [...options.path || [], key]
				});
				if (adapted !== void 0) data[key] = adapted;
				return value;
			} catch (e) {
				if (!options?.autofix) throw e;
				delete data[key];
				return schema.meta.default;
			}
		}
		Schema.extend("array", (data, { inner, meta }, options) => {
			if (!Array.isArray(data)) throw new ValidationError(`expected array but got ${data}`, options);
			checkWithinRange(data.length, meta, "array length", options, !isNullable(inner.meta.default));
			return [data.map((_, index) => property(data, index, inner, options))];
		});
		Schema.extend("dict", (data, { inner, sKey }, options, strict) => {
			if (!isPlainObject(data)) throw new ValidationError(`expected object but got ${data}`, options);
			const result = {};
			for (const key in data) {
				let rKey;
				try {
					rKey = Schema.resolve(key, sKey, options)[0];
				} catch (error) {
					if (strict) continue;
					throw error;
				}
				result[rKey] = property(data, key, inner, options);
				data[rKey] = data[key];
				if (key !== rKey) delete data[key];
			}
			return [result];
		});
		Schema.extend("tuple", (data, { list }, options, strict) => {
			if (!Array.isArray(data)) throw new ValidationError(`expected array but got ${data}`, options);
			const result = list.map((inner, index) => property(data, index, inner, options));
			if (strict) return [result];
			result.push(...data.slice(list.length));
			return [result];
		});
		function merge(result, data) {
			for (const key in data) {
				if (key in result) continue;
				result[key] = data[key];
			}
		}
		Schema.extend("object", (data, { dict }, options, strict) => {
			if (!isPlainObject(data)) throw new ValidationError(`expected object but got ${data}`, options);
			const result = {};
			for (const key in dict) {
				const value = property(data, key, dict[key], options);
				if (!isNullable(value) || key in data) result[key] = value;
			}
			if (!strict) merge(result, data);
			return [result];
		});
		Schema.extend("union", (data, { list, toString }, options, strict) => {
			const messages = [];
			for (const inner of list) try {
				return Schema.resolve(data, inner, options, strict);
			} catch (error) {
				messages.push(error);
			}
			throw new ValidationError(`expected ${toString()} but got ${JSON.stringify(data)}`, options);
		});
		Schema.extend("intersect", (data, { list, toString }, options, strict) => {
			if (!list.length) return [data];
			let result;
			for (const inner of list) {
				const value = Schema.resolve(data, inner, options, true)[0];
				if (isNullable(value)) continue;
				if (isNullable(result)) result = value;
				else if (typeof result !== typeof value) throw new ValidationError(`expected ${toString()} but got ${JSON.stringify(data)}`, options);
				else if (typeof value === "object") merge(result ??= {}, value);
				else if (result !== value) throw new ValidationError(`expected ${toString()} but got ${JSON.stringify(data)}`, options);
			}
			if (!strict && isPlainObject(data)) merge(result, data);
			return [result];
		});
		Schema.extend("transform", (data, { inner, callback, preserve }, options) => {
			const [result, adapted = data] = Schema.resolve(data, inner, options, true);
			if (preserve) return [callback(result)];
			else return [callback(result), callback(adapted)];
		});
		const formatters = {};
		function defineMethod(name, keys, format) {
			formatters[name] = format;
			Object.assign(Schema, { [name](...args) {
				const schema = new Schema({ type: name });
				keys.forEach((key, index) => {
					switch (key) {
						case "sKey":
							schema.sKey = args[index] ?? Schema.string();
							break;
						case "inner":
							schema.inner = Schema.from(args[index]);
							break;
						case "list":
							schema.list = args[index].map(Schema.from);
							break;
						case "dict":
							schema.dict = mapValues(args[index], Schema.from);
							break;
						case "bits":
							schema.bits = {};
							for (const key in args[index]) {
								if (typeof args[index][key] !== "number") continue;
								schema.bits[key] = args[index][key];
							}
							break;
						case "callback": {
							const callback = schema.callback = args[index];
							callback["toJSON"] ||= () => callback.toString();
							break;
						}
						case "constructor": {
							const constructor = schema.constructor = args[index];
							if (typeof constructor === "function") constructor["toJSON"] ||= () => constructor["name"];
							break;
						}
						default: schema[key] = args[index];
					}
				});
				if (name === "object" || name === "dict") schema.meta.default = {};
				else if (name === "array" || name === "tuple") schema.meta.default = [];
				else if (name === "bitset") schema.meta.default = 0;
				return schema;
			} });
		}
		defineMethod("is", ["constructor"], ({ constructor }) => {
			if (typeof constructor === "function") return constructor.name;
			else return constructor;
		});
		defineMethod("any", [], () => "any");
		defineMethod("never", [], () => "never");
		defineMethod("const", ["value"], ({ value }) => typeof value === "string" ? JSON.stringify(value) : value);
		defineMethod("string", [], () => "string");
		defineMethod("number", [], () => "number");
		defineMethod("boolean", [], () => "boolean");
		defineMethod("bitset", ["bits"], () => "bitset");
		defineMethod("function", [], () => "function");
		defineMethod("array", ["inner"], ({ inner }) => `${inner.toString(true)}[]`);
		defineMethod("dict", ["inner", "sKey"], ({ inner, sKey }) => `{ [key: ${sKey.toString()}]: ${inner.toString()} }`);
		defineMethod("tuple", ["list"], ({ list }) => `[${list.map((inner) => inner.toString()).join(", ")}]`);
		defineMethod("object", ["dict"], ({ dict }) => {
			if (Object.keys(dict).length === 0) return "{}";
			return `{ ${Object.entries(dict).map(([key, inner]) => {
				return `${key}${inner.meta.required ? "" : "?"}: ${inner.toString()}`;
			}).join(", ")} }`;
		});
		defineMethod("union", ["list"], ({ list }, inline) => {
			const result = list.map(({ toString: format }) => format()).join(" | ");
			return inline ? `(${result})` : result;
		});
		defineMethod("intersect", ["list"], ({ list }) => {
			return `${list.map((inner) => inner.toString(true)).join(" & ")}`;
		});
		defineMethod("transform", [
			"inner",
			"callback",
			"preserve"
		], ({ inner }, isInner) => inner.toString(isInner));
		//#endregion
		//#region src/theme-settings.ts
		/** Background-image user settings stored in the Host user-settings document. */
		/** Field carrying the background image (a `data:` URL produced by the upload control). */
		const BACKGROUND_IMAGE_FIELD = "image";
		/** Default scrim strength when the user document has no override. */
		const DEFAULT_BACKGROUND_DIM = .55;
		/**
		* Headroom for the `data:` prefix over the base64 expansion of
		* {@link MAX_BACKGROUND_IMAGE_BYTES}; the Host schema caps the stored string so
		* an oversized write fails at the durable boundary even if the client check is
		* bypassed.
		*/
		const MAX_BACKGROUND_IMAGE_DATA_URL_LENGTH = Math.ceil(4 * 1024 * 1024 * 4 / 3) + 1024;
		Schema.object({
			[BACKGROUND_IMAGE_FIELD]: Schema.string().max(MAX_BACKGROUND_IMAGE_DATA_URL_LENGTH).default(""),
			["dim"]: Schema.number().min(0).max(1).default(DEFAULT_BACKGROUND_DIM)
		});
		//#endregion
		//#region src/client/image-file.ts
		/** Upload admission, downscaling, and file reading for the background control. */
		/** Raster media types the upload control accepts. */
		const BACKGROUND_MEDIA_TYPES = [
			"image/png",
			"image/jpeg",
			"image/webp",
			"image/gif"
		];
		/** Longest edge the stored background is scaled to (keeps the durable data URL small). */
		const MAX_BACKGROUND_DIMENSION = 1920;
		/** JPEG quality used when re-encoding the downscaled background. */
		const BACKGROUND_JPEG_QUALITY = .85;
		/**
		* Validate a selected file against the background admission policy.
		* @param file - selected file (size and declared media type).
		* @returns a rejection reason key, or `null` when the file is accepted.
		*/
		function validateBackgroundFile(file) {
			if (file.size > 4194304) return "upload.tooLarge";
			if (!BACKGROUND_MEDIA_TYPES.includes(file.type)) return "upload.unsupportedType";
			return null;
		}
		/**
		* Compute the downscaled dimensions that keep the aspect ratio and bound the
		* longest edge by {@link MAX_BACKGROUND_DIMENSION}.
		* @param width - intrinsic width in pixels.
		* @param height - intrinsic height in pixels.
		* @returns the target dimensions (never larger than the input, minimum 1px).
		*/
		function computeBackgroundDimensions(width, height) {
			if (width <= 0 || height <= 0) return {
				width: 1,
				height: 1
			};
			const scale = Math.min(1, MAX_BACKGROUND_DIMENSION / Math.max(width, height));
			return {
				width: Math.max(1, Math.round(width * scale)),
				height: Math.max(1, Math.round(height * scale))
			};
		}
		/**
		* Read a file as a `data:` URL.
		* @param file - accepted image file.
		* @returns the file's `data:` URL.
		*/
		function readFileAsDataUrl(file) {
			return new Promise((resolve, reject) => {
				const reader = new FileReader();
				reader.onload = () => {
					resolve(reader.result);
				};
				reader.onerror = () => {
					reject(reader.error ?? /* @__PURE__ */ new Error("background image read failed"));
				};
				reader.readAsDataURL(file);
			});
		}
		/** Load a `data:` URL into a decoded image element. */
		function loadImage(source) {
			return new Promise((resolve, reject) => {
				const img = new Image();
				img.onload = () => {
					resolve(img);
				};
				img.onerror = () => {
					reject(/* @__PURE__ */ new Error("background image decode failed"));
				};
				img.src = source;
			});
		}
		/**
		* Downscale and re-encode a `data:` URL image to the background budget.
		* @param source - decoded `data:` URL image.
		* @returns a JPEG `data:` URL bounded to {@link MAX_BACKGROUND_DIMENSION}.
		*/
		function downscaleImageToDataUrl(source) {
			return loadImage(source).then((img) => {
				const { width, height } = computeBackgroundDimensions(img.naturalWidth, img.naturalHeight);
				const canvas = document.createElement("canvas");
				canvas.width = width;
				canvas.height = height;
				const context = canvas.getContext("2d");
				if (context === null) throw new Error("background image scaling failed");
				context.drawImage(img, 0, 0, width, height);
				return canvas.toDataURL("image/jpeg", BACKGROUND_JPEG_QUALITY);
			});
		}
		/**
		* Read, downscale, and re-encode a selected file as a JPEG `data:` URL.
		* @param file - accepted image file.
		* @returns the downscaled JPEG `data:` URL.
		*/
		function readBackgroundDataUrl(file) {
			return readFileAsDataUrl(file).then(downscaleImageToDataUrl);
		}
		//#endregion
		//#region \0dsh-css:/lustre/qzhong/deepseek-harness/ui-background/src/client/BackgroundRow.module.css.mjs
		const css = ".AtsA2W_group{border-bottom:1px solid var(--dsw-alias-border-l2);flex-direction:column;gap:8px;padding:16px 0;display:flex}.AtsA2W_title{color:var(--dsw-alias-label-primary);font-size:14px;font-weight:400;line-height:22px}.AtsA2W_row{flex-wrap:wrap;align-items:center;gap:8px;display:flex}.AtsA2W_input{display:none}.AtsA2W_control{box-sizing:border-box;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-button-elevated-fill);height:32px;font:inherit;color:var(--dsw-alias-label-primary);cursor:pointer;border-radius:8px;padding:0 12px;font-size:13px;line-height:20px}.AtsA2W_control:hover{background:var(--dsw-alias-interactive-bg-hover)}.AtsA2W_preview{object-fit:cover;border:1px solid var(--dsw-alias-border-l2);border-radius:8px;width:64px;height:40px}.AtsA2W_dimRow{align-items:center;gap:12px;display:flex}.AtsA2W_dimLabel{color:var(--dsw-alias-label-secondary);flex:none;font-size:13px;line-height:20px}.AtsA2W_dimSlider{flex:1;min-width:0}.AtsA2W_error{color:var(--dsw-alias-state-error-primary);font-size:12px;line-height:18px}";
		const tagId = "dsh-ui-background/BackgroundRow.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-ui-background";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		var BackgroundRow_module_css_default = {
			"row": "AtsA2W_row",
			"preview": "AtsA2W_preview",
			"dimLabel": "AtsA2W_dimLabel",
			"dimRow": "AtsA2W_dimRow",
			"control": "AtsA2W_control",
			"dimSlider": "AtsA2W_dimSlider",
			"title": "AtsA2W_title",
			"error": "AtsA2W_error",
			"input": "AtsA2W_input",
			"group": "AtsA2W_group"
		};
		//#endregion
		//#region src/client/BackgroundRow.tsx
		/**
		* Background preference row registered into the General section item slot:
		* title, upload/replace control, preview, remove, and a scrim-strength slider.
		* Selection reads the persisted image and scrim from the row store; writes
		* route through the injected face to the settings scope (which the plugin's
		* apply also projects onto the theme override token).
		*/
		/**
		* Render the Background row.
		* @param props - composed slot props.
		* @returns the row element tree.
		*/
		function BackgroundRow({ t, setImage, clearImage, setDim, useStore }) {
			const image = useStore((state) => state.image);
			const storedDim = useStore((state) => state.dim);
			const inputRef = (0, react.useRef)(null);
			const [error, setError] = (0, react.useState)(null);
			const [dim, setDimDraft] = (0, react.useState)(storedDim);
			(0, react.useEffect)(() => {
				setDimDraft(storedDim);
			}, [storedDim]);
			const handleFile = (file) => {
				const problem = validateBackgroundFile(file);
				if (problem !== null) {
					setError(problem);
					return;
				}
				setError(null);
				readBackgroundDataUrl(file).then(setImage).catch(() => {
					setError("upload.readError");
				});
			};
			const handleDim = (value) => {
				setDimDraft(value);
				setDim(value);
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: BackgroundRow_module_css_default.group,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: BackgroundRow_module_css_default.title,
						children: t("background.title")
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: BackgroundRow_module_css_default.row,
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
								ref: inputRef,
								type: "file",
								accept: "image/png,image/jpeg,image/webp,image/gif",
								className: BackgroundRow_module_css_default.input,
								onChange: (event) => {
									const file = event.target.files?.[0];
									if (file !== void 0) handleFile(file);
									event.target.value = "";
								}
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: clsx(BackgroundRow_module_css_default.control, image !== "" && BackgroundRow_module_css_default.replace),
								onClick: () => {
									inputRef.current?.click();
								},
								children: t(image === "" ? "background.upload" : "background.replace")
							}),
							image !== "" && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("img", {
								className: BackgroundRow_module_css_default.preview,
								src: image,
								alt: t("background.preview")
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: BackgroundRow_module_css_default.control,
								onClick: clearImage,
								children: t("background.remove")
							})] })
						]
					}),
					image !== "" && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: BackgroundRow_module_css_default.dimRow,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: BackgroundRow_module_css_default.dimLabel,
							children: t("background.dim")
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
							type: "range",
							min: 0,
							max: 1,
							step: .05,
							value: dim,
							className: BackgroundRow_module_css_default.dimSlider,
							onChange: (event) => {
								handleDim(Number(event.target.value));
							}
						})]
					}),
					error !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: BackgroundRow_module_css_default.error,
						children: t(error)
					})
				]
			});
		}
		//#endregion
		//#region src/client/background-storage.ts
		/**
		* Browser-local persistence for the background settings. The plugin keeps its
		* own storage instead of routing through the Host settings Remote, so it can
		* run against an unmodified harness: the settings Remote only exposes
		* namespaces allowlisted by the api-proxy package, and a distributable plugin
		* cannot add itself to that list.
		*/
		/** localStorage key under which the plugin stores its settings envelope. */
		const BACKGROUND_STORAGE_KEY = "dsh-ui-background:background.v1";
		/** Default persisted background section. */
		function defaultBackgroundSettings() {
			return {
				image: "",
				dim: DEFAULT_BACKGROUND_DIM
			};
		}
		/**
		* Read and validate the persisted background section from localStorage.
		* Malformed or out-of-range values fall back field-by-field to the defaults,
		* so a damaged envelope never breaks the row or the theme override.
		* @returns the validated persisted section.
		*/
		function loadBackgroundSettings() {
			if (typeof localStorage === "undefined") return defaultBackgroundSettings();
			const raw = localStorage.getItem(BACKGROUND_STORAGE_KEY);
			if (raw === null) return defaultBackgroundSettings();
			try {
				const parsed = JSON.parse(raw);
				if (typeof parsed !== "object" || parsed === null) return defaultBackgroundSettings();
				const { image, dim } = parsed;
				return {
					image: typeof image === "string" ? image : "",
					dim: typeof dim === "number" && Number.isFinite(dim) ? Math.min(1, Math.max(0, dim)) : DEFAULT_BACKGROUND_DIM
				};
			} catch (_malformedEnvelope) {
				return defaultBackgroundSettings();
			}
		}
		/**
		* Persist the background section to localStorage.
		* @param value - the section to write.
		*/
		function saveBackgroundSettings(value) {
			if (typeof localStorage === "undefined") return;
			localStorage.setItem(BACKGROUND_STORAGE_KEY, JSON.stringify(value));
		}
		//#endregion
		//#region src/client/settings-store.ts
		/**
		* Background row slot store: a mirror of the settings scope value. The
		* plugin's apply-world change listener is the only writer; the row component
		* reads via props.useStore.
		*/
		/**
		* Declares the Background row state and write surface.
		* @returns the store handle.
		*/
		function createBackgroundRowStore() {
			return (0, _deepseek_ai_dsh_client_runtime_client.defineStore)({
				init: () => ({
					image: "",
					dim: DEFAULT_BACKGROUND_DIM
				}),
				actions: { sync: (d, image, dim) => {
					d.image = image;
					d.dim = dim;
				} }
			});
		}
		//#endregion
		//#region src/client/locales.ts
		/** `settings.background` namespace dictionaries (the Background row's copy). */
		/** Simplified Chinese dictionary (the key-set source of truth). */
		const zh = {
			"background.title": "背景图片",
			"background.upload": "上传图片",
			"background.replace": "更换图片",
			"background.remove": "移除",
			"background.preview": "背景图片预览",
			"background.dim": "背景变暗",
			"upload.tooLarge": "图片过大（上限 4 MB）",
			"upload.unsupportedType": "不支持的图片格式（仅支持 PNG、JPEG、WebP、GIF）",
			"upload.readError": "图片读取失败"
		};
		/** English dictionary, checked complete against the zh key set. */
		const en = {
			"background.title": "Background image",
			"background.upload": "Upload image",
			"background.replace": "Replace image",
			"background.remove": "Remove",
			"background.preview": "Background image preview",
			"background.dim": "Dim background",
			"upload.tooLarge": "Image is too large (max 4 MB)",
			"upload.unsupportedType": "Unsupported format (PNG, JPEG, WebP, GIF only)",
			"upload.readError": "Failed to read the image"
		};
		//#endregion
		//#region src/client/index.ts
		/** Namespace owning this feature's settings-row copy. */
		const SETTINGS_NS = "settings.background";
		/** Theme token the plugin sets and its injected shell styles consume. */
		const BACKGROUND_IMAGE_TOKEN = "--dsw-alias-bg-image";
		/**
		* Shell-surface selectors the injected stylesheet paints. The AppFrame root is
		* the sole element child of #root after boot; the conversation and details
		* roots are the first children of the center and details grid columns
		* (children 2 and 3 of the AppFrame root).
		*/
		const BACKGROUND_STYLE = `
#root > div {
  background-image: var(--dsw-alias-bg-image, none);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
#root > div > div:nth-child(2) > *,
#root > div > div:nth-child(3) > * {
  background-image: var(--dsw-alias-bg-image, none);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}`;
		/** Required services: slots/locale for the row and theme for the override layer. */
		const inject = [
			"slots",
			"locale",
			"theme"
		];
		/**
		* Wrap a data URL and scrim strength as the per-palette background-image value:
		* a scrim (white in light, black in dark) layered over the image.
		* @param image - the background image `data:` URL.
		* @param dim - scrim strength (0–1).
		* @returns the composed per-palette values.
		*/
		function tokenValue(image, dim) {
			return {
				light: `linear-gradient(rgba(255, 255, 255, ${dim}), rgba(255, 255, 255, ${dim})), url("${image}")`,
				dark: `linear-gradient(rgba(0, 0, 0, ${dim}), rgba(0, 0, 0, ${dim})), url("${image}")`
			};
		}
		/**
		* Client plugin body: apply the persisted image through a theme override layer
		* and an injected shell-surface stylesheet, then register the upload row.
		* @param ctx - client cordis context.
		*/
		function apply(ctx) {
			const store = createBackgroundRowStore();
			let bound;
			let disposeOverride;
			const applyImage = () => {
				disposeOverride?.();
				disposeOverride = void 0;
				const value = loadBackgroundSettings();
				if (value.image === "") return;
				disposeOverride = ctx.theme.overrideTokens("ui-background", { [BACKGROUND_IMAGE_TOKEN]: tokenValue(value.image, value.dim) });
			};
			const publish = (image, dim) => {
				saveBackgroundSettings({
					image,
					dim
				});
				bound?.sync(image, dim);
				applyImage();
			};
			ctx.effect(() => {
				applyImage();
				const onStorage = (event) => {
					if (event.key === null || event.key === "dsh-ui-background:background.v1") applyImage();
				};
				window.addEventListener("storage", onStorage);
				return () => {
					window.removeEventListener("storage", onStorage);
					disposeOverride?.();
				};
			}, "ui-background: theme override + storage sync");
			ctx.effect(() => {
				const style = document.createElement("style");
				style.dataset.plugin = "dsh-ui-background";
				style.dataset.pluginCss = "dsh-ui-background/shell-background";
				style.textContent = BACKGROUND_STYLE;
				document.head.appendChild(style);
				return () => {
					style.remove();
				};
			}, "ui-background: shell background styles");
			ctx.effect(() => ctx.locale.register(SETTINGS_NS, {
				zh,
				en
			}), "ui-background: settings row dictionaries");
			const injected = (actions) => {
				bound = actions;
				const value = loadBackgroundSettings();
				actions.sync(value.image, value.dim);
				return {
					setImage: (image) => {
						publish(image, loadBackgroundSettings().dim);
					},
					clearImage: () => {
						publish("", loadBackgroundSettings().dim);
					},
					setDim: (dim) => {
						publish(loadBackgroundSettings().image, dim);
					}
				};
			};
			ctx.slots.inject("settings.general.item", () => ctx.slots.register({
				name: "settings.general.item",
				id: "background",
				order: 20,
				store,
				locale: SETTINGS_NS,
				inject: injected
			}, BackgroundRow));
		}
		//#endregion
		exports.BACKGROUND_IMAGE_TOKEN = BACKGROUND_IMAGE_TOKEN;
		exports.SETTINGS_NS = SETTINGS_NS;
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map