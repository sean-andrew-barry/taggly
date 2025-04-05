// import {Debug as D} from "/js/Utility/Debug.js";


import {Environment} from "/js/Environment.js";

// The GeneratorFunction is not a global object, so this is a way to obtain it
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/GeneratorFunction
export const GeneratorFunction = Object.getPrototypeOf(function*(){}).constructor;
export const SEEN = new WeakSet();

export class Debug
{
  static IsGlobalThis(v){ return v === globalThis && this; }
  static IsUndefined(v){ return v === undefined && this; }
  static IsNull(v){ return v === null && this; }
  static IsNotDefined(v){ return (v === undefined) || (v === null) && this; }
  static IsDefined(v){ return (v !== undefined) && (v !== null) && this; }
  static IsInfinity(v){ return v === Infinity && this; }
  static IsTrue(v){ return v === true && this; }
  static IsFalse(v){ return v === false && this; }
  static IsTruthy(v){ return v ? true : false && this; }
  static IsFalsy(v){ return v ? false : true && this; }
  static IsOnServer(v){ return Environment.IsServer() === true && this; }
  static IsOnClient(v){ return Environment.IsClient() === true && this; }
  static IsInlineFrame(v){ return Environment.IsInlineFrame() === true && this; }

  static IsPrimitive(v)
  {
    switch (typeof v)
    {
      case "string" :
      case "number" :
      case "symbol" :
      case "boolean":
      {
        return this;
      }
    }

    return undefined;
  }

  static IsNumber       (v){ return (typeof(v) === "number") && (!Number.isNaN(v)) ? this : undefined; }
  static IsNaN          (v){ return Number.isNaN(v) ? this : undefined; }
  static IsInfinite     (v){ return !Number.isFinite(v) ? this : undefined; }
  static IsFinite       (v){ return Number.isFinite(v) ? this : undefined; }
  static IsMaxSafeInt   (v){ return (v === Number.MAX_SAFE_INTEGER) ? this : undefined; }
  static IsMinSafeInt   (v){ return (v === Number.MIN_SAFE_INTEGER) ? this : undefined; }
  static IsMaxNumber    (v){ return (v === Number.MAX_VALUE) ? this : undefined; }
  static IsMinNumber    (v){ return (v === Number.MIN_VALUE) ? this : undefined; }
  static IsFloat        (v){ return Debug.Number(v) && (v % 1 !== 0) ? this : undefined; }
  static IsInt          (v){ return Debug.Number(v) && (v % 1 === 0) ? this : undefined; }
  static IsFunction     (v){ return (typeof(v) === "function") ? this : undefined; }
  static IsSymbol       (v){ return (typeof(v) === "symbol") ? this : undefined; }
  static IsBoolean      (v){ return (typeof(v) === "boolean") ? this : undefined; }
  static IsString       (v){ return (typeof(v) === "string") ? this : undefined; }
  static IsObject       (v){ return (v !== null) && (typeof(v) === "object") ? this : undefined; }
  static IsNode         (v){ return (v instanceof window.Node) ? this : undefined; }
  static IsElement      (v){ return (v instanceof window.Element) ? this : undefined; }
  static IsRegExp       (v){ return (v instanceof RegExp) ? this : undefined; }
  static IsPromise      (v){ return (v instanceof Promise) ? this : undefined; }
  static IsArray        (v){ return (v instanceof Array) ? this : undefined; }
  static IsInt8Array    (v){ return (v instanceof Int8Array) ? this : undefined; }
  static IsUint8Array   (v){ return (v instanceof Uint8Array) ? this : undefined; }
  static IsUint8ClampedArray(v){ return (v instanceof Uint8ClampedArray) ? this : undefined; }
  static IsInt16Array   (v){ return (v instanceof Int16Array) ? this : undefined; }
  static IsUint16Array  (v){ return (v instanceof Uint16Array) ? this : undefined; }
  static IsInt32Array   (v){ return (v instanceof Int32Array) ? this : undefined; }
  static IsUint32Array  (v){ return (v instanceof Uint32Array) ? this : undefined; }
  static IsFloat32Array (v){ return (v instanceof Float32Array) ? this : undefined; }
  static IsFloat64Array (v){ return (v instanceof Float64Array) ? this : undefined; }
  static IsBigInt64Array (v){ return (v instanceof BigInt64Array) ? this : undefined; }
  static IsBigUint64Array(v){ return (v instanceof BigUint64Array) ? this : undefined; }
  static IsArrayBuffer  (v){ return (v instanceof ArrayBuffer) ? this : undefined; }
  static IsError        (v){ return (v instanceof Error) ? this : undefined; }
  static IsTypeError    (v){ return (v instanceof TypeError) ? this : undefined; }
  static IsBigInt       (v){ return (v instanceof BigInt) ? this : undefined; }
  static IsDate         (v){ return (v instanceof Date) ? this : undefined; }
  static IsMap          (v){ return (v instanceof Map) ? this : undefined; }
  static IsWeakMap      (v){ return (v instanceof WeakMap) ? this : undefined; }
  static IsSet          (v){ return (v instanceof Set) ? this : undefined; }
  static IsWeakSet      (v){ return (v instanceof WeakSet) ? this : undefined; }
  static IsProxy        (v){ return (v instanceof Proxy) ? this : undefined; }
  static IsGenerator    (v){ return (v instanceof Generator) ? this : undefined; }
  static IsGeneratorFunction(v){ return (v instanceof GeneratorFunction) ? this : undefined; }
  static IsIterable     (v){ return this.IsObject(v) && this.IsFunction(v[Symbol.iterator]) ? this : undefined; }
  static IsObjectLiteral(v){ return this.IsObject(v) && (v.constructor === Object) ? this : undefined; }
  static IsObjectEmpty  (v){ return this.IsObject(v) && Object.keys(v).length === 0 ? this : undefined; }
  static IsClass        (v){ return this.IsObject(v) && this.IsFunction(v.constructor) && (v.constructor !== Object) ? this : undefined; }
  static IsClass        (v){ return this.IsFunction(v) && (v !== Object) && this.IsInstanceOf(v.prototype, Object) ? this : undefined; }

  static IsOptionalString(v){ return v === undefined || this.IsString(v) ? this : undefined; }
  static IsOptionalNumber(v){ return v === undefined || this.IsNumber(v) ? this : undefined; }
  static IsOptionalBoolean(v){ return v === undefined || this.IsBoolean(v) ? this : undefined; }
  static IsOptionalFunction(v){ return v === undefined || this.IsFunction(v) ? this : undefined; }
  static IsOptionalSymbol(v){ return v === undefined || this.IsSymbol(v) ? this : undefined; }
  static IsOptionalObject(v){ return v === undefined || this.IsObject(v) ? this : undefined; }
  static IsOptionalArray(v){ return v === undefined || this.IsArray(v) ? this : undefined; }
  static IsOptionalNull(v){ return v === undefined || this.IsNull(v) ? this : undefined; }

  // An easy way to test if an object has been viewed before in some sort of algorithm
  static Seen(v, seen = SEEN)
  {
    if (!this.IsObject(v)) return;
    else if (seen.has(v)) return this;

    seen.add(v);
    return;
  }

  static IsValidString(v){ return this.IsString(v) && v.length > 0 ? this : undefined; }
  static IsValidNumber(v){ return this.IsNumber(v) && v > 0 ? this : undefined; }
  static IsValidArray (v){ return this.IsArray (v) && v.length > 0 ? this : undefined; }
  static IsValidObject(v){ return this.IsObject(v) && Object.keys(v).length > 0 ? this : undefined; }

  static IsInstanceOf (a, b){ return (a instanceof b) ? this : undefined; }
  static IsConstructorOf(a, b){ return this.IsFunction(a) && this.IsInstanceOf(a.prototype, b) ? this : undefined; }
  static IsExtending(a, b){ return this.IsFunction(a) && this.IsInstanceOf(a.prototype, b) ? this : undefined; }
  static IsChildOf    (a, b){ return (a instanceof b) && this.IsFunction(a.constructor) && (a.constructor !== b) ? this : undefined; }
  static IsCloseTo    (a, b, r = 0.001){ return this.IsNumber(a) && this.IsNumber(b) && (Math.abs(a - b) <= r) ? this : undefined; }
  static IsMatch      (a, b){ return this.IsString(a) && this.IsRegExp(b) && (a.match(b) !== null) ? this : undefined; }
  static IsLength     (a, b){ return this.IsNumber(a.length) && this.IsNumber(b) && (a.length === b) ? this : undefined; }
  static IsLongerThan (a, b){ return this.IsNumber(a.length) && this.IsNumber(b) && (a.length > b) ? this : undefined; }
  static IsShorterThan(a, b){ return this.IsNumber(a.length) && this.IsNumber(b) && (a.length < b) ? this : undefined; }
  static IsSame       (a, b){ return Object.is(a, b) ? this : undefined; }
  static IsEqual      (a, b){ return (a === b) ? this : undefined; }
  static IsType       (a, b){ return (typeof a === b) ? this : undefined; }

  static GreaterThan       (a, b){ return this.IsNumber(a) && this.IsNumber(b) && a >  b ? this : undefined; }
  static GreaterThanOrEqual(a, b){ return this.IsNumber(a) && this.IsNumber(b) && a >= b ? this : undefined; }
  static LessThan          (a, b){ return this.IsNumber(a) && this.IsNumber(b) && a <  b ? this : undefined; }
  static LessThanOrEqualTo (a, b){ return this.IsNumber(a) && this.IsNumber(b) && a <= b ? this : undefined; }

  static InRange(v, min, max){ return Debug.GreaterThanOrEqual(v, min) && Debug.LessThanOrEqual(v, max); }
  static Within (v, min, max){ return Debug.GreaterThanOrEqual(v, min) && Debug.LessThanOrEqual(v, max); }
  static Between(v, min, max){ return Debug.GreaterThan(v, min) && Debug.LessThan(v, max); }

  static LengthBetween(v, min, max){ return Debug.Number(v.length) && Debug.Between(v.length, min, max); }
  static LengthInRange(v, min, max){ return Debug.Number(v.length) && Debug.InRange(v.length, min, max); }

  static OlderThan(v, date){ return Debug.Date(v) && Debug.Date(date) && v > date; }
  static YoungerThan(v, date){ return Debug.Date(v) && Debug.Date(date) && v < date; }
  static SameAge(v, date){ return Debug.Date(v) && Debug.Date(date) && v.getTime() === date.getTime(); }

  static Throwing(fn)
  {
    if (!Debug.Function(fn)) return false;

    try
    {
      fn();
      return false;
    }
    catch (error)
    {
      return true;
    }
  }

  static Resolving(fn)
  {
    if (!Debug.Function(fn)) return false;
    return Promise.resolve(fn()).then(r => true).catch(e => false);
  }

  static Rejecting(fn)
  {
    if (!Debug.Function(fn)) return false;
    return Promise.resolve(fn()).then(r => false).catch(e => true);
  }

  static UpperCase(v){ return v.toUpperCase() === v; }
  static LowerCase(v){ return v.toLowerCase() === v; }
  static AllDigits(v){ return /^\d+$/.test(v); }

  static ContainsPattern(v, p, c = 1){ return (v.match(p) || []).length >= c; }

  static ContainsUpperCase(v, c){ return Debug.ContainsPattern(v, /[A-Z]/g, c); }
  static ContainsLowerCase(v, c){ return Debug.ContainsPattern(v, /[a-z]/g, c); }
  static ContainsDigits(v, c){ return Debug.ContainsPattern(v, /\d/g, c); }
  static ContainsSpaces(v, c){ return Debug.ContainsPattern(v, /\s/g, c); }
  static ContainsAlNums(v, c){ return Debug.ContainsPattern(v, /\w/g, c); }
  static ContainsSymbols(v, c){ return Debug.ContainsPattern(v, /[|\/~^:,;?!&%$@*+]/g, c); }

  static ContainsNonUpperCase(v, c){ return Debug.ContainsPattern(v, /[^A-Z]/g, c); }
  static ContainsNonLowerCase(v, c){ return Debug.ContainsPattern(v, /[^a-z]/g, c); }
  static ContainsNonDigits(v, c){ return Debug.ContainsPattern(v, /\D/g, c); }
  static ContainsNonSpaces(v, c){ return Debug.ContainsPattern(v, /\S/g, c); }
  static ContainsNonAlNums(v, c){ return Debug.ContainsPattern(v, /\W/g, c); }
  static ContainsNonSymbols(v, c){ return Debug.ContainsPattern(v, /[^|\/~^:,;?!&%$@*+]/g, c); }

  static ContainsAnyUpperCase(v){ return v.toLowerCase() !== v; }
  static ContainsAnyLowerCase(v){ return v.toUpperCase() !== v; }

  static HasKey(object, key){ return object.hasOwnProperty(key); }
  static HasValidKey(object, key){ return !!object[key]; }
  static HasKeyCount(object, count){ return Object.keys(object).length === count; }

  static HasElement(array, value)
  {
    for (let i = 0; i < array.length; i++)
    {
      if (array[i] === value) return true;
    }

    return false;
  }

  // Return an ESTIMATE of an object size in bytes
  static SizeOf(value, visited = new WeakSet())
  {
    switch (typeof(value))
    {
      case "undefined": return 0; // Unsure, seems like it should take SOME space, right?
      case "symbol": return 0; // Unsure
      case "boolean": return 4; // NOTE: Uhh is this right? Seems high, but that's what people said
      case "number": return 8; // I think it's 8 byte numbers by default
      case "string": return value.length * 2; // Each character is 2 bytes
      case "object":
      {
        // Again, confusing that it's 0, but that's what people seem to have said.
        if (value === null) return 0;

        // Check for circular references
        // I'm assuming the reference takes some space
        if (visited.has(value)) return 8;

        visited.add(value);

        // NOTE: Do array indexes take up space or are they implicit?
        // Currently this would treat them as 8 byte numbers each
        let size = 0;
        for (let key in value)
        {
          if (value.hasOwnProperty(key))
          {
            size += Debug.SizeOf(key, visited);
            size += Debug.SizeOf(value[key], visited);
          }
        }

        return size;
      }
      default:
      {
        throw new Error(`Unknown type "${typeof(value)}" in Debug.SizeOf`);
      }
    }
  }
}

export class Assert extends Debug
{
  static Fail(reason)
  {
    throw new Error(`Tag ${this.tag.Identify()}'s assertion failed because ${reason}`);
  }

  static IsDefined(v){ return super.IsDefined(v) ?? this.Fail`${v} is not defined`; }
  static IsTrue(v){ return super.IsTrue(v) ?? this.Fail`${v} is not true`; }
  static IsFalse(v){ return super.IsFalse(v) ?? this.Fail`${v} is not false`; }
  static IsTruthy(v){ return super.IsTruthy(v) ?? this.Fail`${v} is not truthy`; }
  static IsFalsy(v){ return super.IsFalsy(v) ?? this.Fail`${v} is not falsy`; }
  static IsUndefined(v){ return super.IsUndefined(v) ?? this.Fail`${v} is not undefined`; }
  static IsNull     (v){ return super.IsNull(v) ?? this.Fail`${v} is not null`; }
  static IsString   (v){ return super.IsString(v) ?? this.Fail`${v} is not a String`; }
  static IsNumber   (v){ return super.IsNumber(v) ?? this.Fail`${v} is not a Number`; }
  static IsFloat(v){ return super.IsFloat(v) ?? this.Fail`${v} is not a Number`; }
  static IsInt(v){ return super.IsInt(v) ?? this.Fail`${v} is not a Number`; }
  static IsBoolean  (v){ return super.IsBoolean(v) ?? this.Fail`${v} is not a Boolean`; }
  static IsFunction (v){ return super.IsFunction(v) ?? this.Fail`${v} is not a Function`; }
  static IsSymbol   (v){ return super.IsSymbol(v) ?? this.Fail`${v} is not a Symbol`; }
  static IsObject   (v){ return super.IsObject(v) ?? this.Fail`${v} is not an Object`; }
  static IsArray    (v){ return super.IsArray(v) ?? this.Fail`${v} is not an Array`; }
  static IsDate     (v){ return super.IsDate(v) ?? this.Fail`${v} is not a Date`; }
  static IsMap      (v){ return super.IsMap(v) ?? this.Fail`${v} is not a Map`; }
  static IsWeakMap  (v){ return super.IsWeakMap(v) ?? this.Fail`${v} is not a WeakMap`; }
  static IsSet      (v){ return super.IsSet(v) ?? this.Fail`${v} is not a Set`; }
  static IsWeakSet  (v){ return super.IsWeakSet(v) ?? this.Fail`${v} is not a WeakSet`; }
  static IsPromise  (v){ return super.IsPromise(v) ?? this.Fail`${v} is not a Promise`; }
  static IsPrimitive(v){ return super.IsPrimitive(v) ?? this.Fail`${v} is not a Primitive`; }
  static IsUint8Array(v){ return super.IsUint8Array(v) ?? this.Fail`${v} is not a Uint8Array`; }
  static IsUint16Array(v){ return super.IsUint16Array(v) ?? this.Fail`${v} is not a Uint16Array`; }
  static IsUint32Array(v){ return super.IsUint32Array(v) ?? this.Fail`${v} is not a Uint32Array`; }
  static IsBigUint64Array(v){ return super.IsBigUint64Array(v) ?? this.Fail`${v} is not a BigUint64Array`; }
  static IsInt8Array(v){ return super.IsInt8Array(v) ?? this.Fail`${v} is not an Int8Array`; }
  static IsUint8Array(v){ return super.IsUint8Array(v) ?? this.Fail`${v} is not a Uint8Array`; }
  static IsUint8ClampedArray(v){ return super.IsUint8ClampedArray(v) ?? this.Fail`${v} is not a Uint8ClampedArray`; }
  static IsInt16Array(v){ return super.IsInt16Array(v) ?? this.Fail`${v} is not an Int16Array`; }
  static IsUint16Array(v){ return super.IsUint16Array(v) ?? this.Fail`${v} is not an Uint16Array`; }
  static IsInt32Array(v){ return super.IsInt32Array(v) ?? this.Fail`${v} is not an Int32Array`; }
  static IsUint32Array(v){ return super.IsUint32Array(v) ?? this.Fail`${v} is not a Uint32Array`; }
  static IsFloat32Array(v){ return super.IsFloat32Array(v) ?? this.Fail`${v} is not a Float32Array`; }
  static IsFloat64Array(v){ return super.IsFloat64Array(v) ?? this.Fail`${v} is not a Float64Array`; }
  static IsBigInt64Array(v){ return super.IsBigInt64Array(v) ?? this.Fail`${v} is not a BigInt64Array`; }
  static IsBigUint64Array(v){ return super.IsBigUint64Array(v) ?? this.Fail`${v} is not a BigUint64Array`; }

  static IsOptionalString(v){ return super.IsOptionalString(v) ?? this.Fail`${v} is not undefined or a String`; }
  static IsOptionalNumber(v){ return super.IsOptionalNumber(v) ?? this.Fail`${v} is not undefined or a Number`; }
  static IsOptionalBoolean(v){ return super.IsOptionalBoolean(v) ?? this.Fail`${v} is not undefined or a Boolean`; }
  static IsOptionalFunction(v){ return super.IsOptionalFunction(v) ?? this.Fail`${v} is not undefined or a Function`; }
  static IsOptionalSymbol(v){ return super.IsOptionalSymbol(v) ?? this.Fail`${v} is not undefined or a Symbol`; }
  static IsOptionalObject(v){ return super.IsOptionalObject(v) ?? this.Fail`${v} is not undefined or a Object`; }
  static IsOptionalArray(v){ return super.IsOptionalArray(v) ?? this.Fail`${v} is not undefined or a Array`; }
  static IsOptionalNull(v){ return super.IsOptionalNull(v) ?? this.Fail`${v} is not undefined or a Null`; }

  static Inherits(v, i){ return super.IsInstanceOf(v, i) ?? this.Fail`${v} does not inherit ${i?.name}`; }
}

export class Failed extends Assert
{
  
}