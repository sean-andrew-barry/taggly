// The GeneratorFunction is not a global object, so this is a way to obtain it
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/GeneratorFunction
export const GeneratorFunction = Object.getPrototypeOf(function*(){}).constructor;
export const SEEN = new WeakSet();

export class Debug
{
  static IsGlobalThis(v){ return v === globalThis; }
  static IsUndefined(v){ return v === undefined; }
  static IsNull(v){ return v === null; }
  static IsNullish(v){ return (v === undefined) || (v === null); }
  static IsNotDefined(v){ return (v === undefined) || (v === null); }
  static IsDefined(v){ return (v !== undefined) && (v !== null); }
  static IsInfinity(v){ return v === Infinity; }
  static IsTrue(v){ return v === true; }
  static IsFalse(v){ return v === false; }
  static IsTruthy(v){ return v ? true : false; }
  static IsFalsy(v){ return v ? false : true; }
  // static IsInlineFrame(v){ return global.IsInlineFrame() === true; }
  static IsServer(){ return false; }
  static IsClient(){ return true; }
  static IsInlineFrame(v){ return false; } // TODO

  static IsPrimitive(v)
  {
    switch (typeof(v))
    {
      case "undefined":
      case "string":
      case "number":
      case "bigint":
      case "symbol":
      case "boolean": return true;
      default: return false;
    }
  }

  static IsComplex(v)
  {
    switch (typeof(v))
    {
      case "function": return true;
      case "object": return v !== null;
      default: return false;
    }
  }

  static IsSimple(v){ return !Debug.IsComplex(v); }

  static IsNumber       (v){ return Number(n) === n; } // TODO: Which number test is better?
  static IsNumber       (v){ return (typeof(v) === "number") && (!Number.isNaN(v)); }
  static IsNaN          (v){ return Number.isNaN(v); }
  static IsInfinite     (v){ return !Number.isFinite(v); }
  static IsFinite       (v){ return Number.isFinite(v); }
  static IsMaxSafeInt   (v){ return (v === Number.MAX_SAFE_INTEGER); }
  static IsMinSafeInt   (v){ return (v === Number.MIN_SAFE_INTEGER); }
  static IsMaxNumber    (v){ return (v === Number.MAX_VALUE); }
  static IsMinNumber    (v){ return (v === Number.MIN_VALUE); }
  static IsFloat        (v){ return Debug.IsNumber(v) && (v % 1 !== 0); }
  static IsInt          (v){ return Debug.IsNumber(v) && (v % 1 === 0); }
  static IsFunction     (v){ return (typeof(v) === "function"); }
  static IsSymbol       (v){ return (typeof(v) === "symbol"); }
  static IsBoolean      (v){ return (typeof(v) === "boolean"); }
  static IsString       (v){ return (typeof(v) === "string"); }
  static IsObject       (v){ return (v !== null) && (typeof(v) === "object"); }
  static IsNode         (v){ return (v instanceof window.Node); }
  static IsElement      (v){ return (v instanceof window.Element); }
  static IsRegExp       (v){ return (v instanceof RegExp); }
  static IsPromise      (v){ return (v instanceof Promise); }
  static IsArray        (v){ return (v instanceof Array); }
  static IsInt8Array    (v){ return (v instanceof Int8Array); }
  static IsUint8Array   (v){ return (v instanceof Uint8Array); }
  static IsUint8ClampedArray(v){ return (v instanceof Uint8ClampedArray); }
  static IsInt16Array   (v){ return (v instanceof Int16Array); }
  static IsUint16Array  (v){ return (v instanceof Uint16Array); }
  static IsInt32Array   (v){ return (v instanceof Int32Array); }
  static IsUint32Array  (v){ return (v instanceof Uint32Array); }
  static IsFloat32Array (v){ return (v instanceof Float32Array); }
  static IsFloat64Array (v){ return (v instanceof Float64Array); }
  static IsBigInt64Array (v){ return (v instanceof BigInt64Array); }
  static IsBigUint64Array(v){ return (v instanceof BigUint64Array); }
  static IsArrayBuffer  (v){ return (v instanceof ArrayBuffer); }
  static IsError        (v){ return (v instanceof Error); }
  static IsTypeError    (v){ return (v instanceof TypeError); }
  static IsBigInt       (v){ return (v instanceof BigInt); }
  static IsDate         (v){ return (v instanceof Date); }
  static IsMap          (v){ return (v instanceof Map); }
  static IsWeakMap      (v){ return (v instanceof WeakMap); }
  static IsSet          (v){ return (v instanceof Set); }
  static IsWeakSet      (v){ return (v instanceof WeakSet); }
  static IsProxy        (v){ return (v instanceof Proxy); }
  static IsGenerator    (v){ return (v instanceof Generator); }
  static IsGeneratorFunction(v){ return (v instanceof GeneratorFunction); }
  static IsIterable     (v){ return Debug.IsObject(v) && Debug.IsFunction(v[Symbol.iterator]); }
  static IsObjectLiteral(v){ return Debug.IsObject(v) && (v.constructor === Object); }
  static IsObjectEmpty  (v){ return Debug.IsObject(v) && Object.keys(v).length === 0; }
  static IsClass        (v){ return Debug.IsObject(v) && Debug.IsFunction(v.constructor) && (v.constructor !== Object); }
  static IsClass        (v){ return Debug.IsFunction(v) && (v !== Object) && Debug.IsInstanceOf(v.prototype, Object); }

  static IsOptionalString(v){ return v === undefined || Debug.IsString(v); }
  static IsOptionalNumber(v){ return v === undefined || Debug.IsNumber(v); }
  static IsOptionalBoolean(v){ return v === undefined || Debug.IsBoolean(v); }
  static IsOptionalFunction(v){ return v === undefined || Debug.IsFunction(v); }
  static IsOptionalSymbol(v){ return v === undefined || Debug.IsSymbol(v); }
  static IsOptionalObject(v){ return v === undefined || Debug.IsObject(v); }
  static IsOptionalArray(v){ return v === undefined || Debug.IsArray(v); }
  static IsOptionalNull(v){ return v === undefined || Debug.IsNull(v); }

  static IsView(v){ return ArrayBuffer.isView(v); }
  static IsStringOrView(v){ return Debug.IsString(v) || Debug.IsView(v); }

  // An easy way to test if an object has been viewed before in some sort of algorithm
  static IsSeen(v, seen = SEEN)
  {
    if (!Debug.IsObject(v)) return false;
    else if (seen.has(v)) return true;

    seen.add(v);
    return false;
  }

  static IsValidString(v){ return Debug.IsString(v) && v.length > 0; }
  static IsValidNumber(v){ return Debug.IsNumber(v) && v > 0; }
  static IsValidArray (v){ return Debug.IsArray (v) && v.length > 0; }
  static IsValidObject(v){ return Debug.IsObject(v) && Object.keys(v).length > 0; }

  static IsInstanceOf (a, b){ return (a instanceof b); }
  static IsConstructorOf(a, b){ return Debug.IsFunction(a) && Debug.IsInstanceOf(a.prototype, b); }
  static IsExtending(a, b){ return Debug.IsFunction(a) && Debug.IsInstanceOf(a.prototype, b); }
  static IsChildOf    (a, b){ return (a instanceof b) && Debug.IsFunction(a.constructor) && (a.constructor !== b); }
  static IsCloseTo    (a, b, r = 0.001){ return Debug.IsNumber(a) && Debug.IsNumber(b) && (Math.abs(a - b) <= r); }
  static IsMatch      (a, b){ return Debug.IsString(a) && Debug.IsRegExp(b) && (a.match(b) !== null); }
  static IsLength     (a, b){ return Debug.IsNumber(a.length) && Debug.IsNumber(b) && (a.length === b); }
  static IsLongerThan (a, b){ return Debug.IsNumber(a.length) && Debug.IsNumber(b) && (a.length > b); }
  static IsShorterThan(a, b){ return Debug.IsNumber(a.length) && Debug.IsNumber(b) && (a.length < b); }
  static IsSame       (a, b){ return Object.is(a, b); }
  static IsEqual      (a, b){ return (a === b); }
  static IsType       (a, b){ return (typeof(a) === b); }

  static IsGreaterThan       (a, b){ return Debug.IsNumber(a) && Debug.IsNumber(b) && a >  b; }
  static IsGreaterThanOrEqual(a, b){ return Debug.IsNumber(a) && Debug.IsNumber(b) && a >= b; }
  static IsLessThan          (a, b){ return Debug.IsNumber(a) && Debug.IsNumber(b) && a <  b; }
  static IsLessThanOrEqualTo (a, b){ return Debug.IsNumber(a) && Debug.IsNumber(b) && a <= b; }

  static IsInRange(v, min, max){ return Debug.IsGreaterThanOrEqual(v, min) && Debug.IsLessThanOrEqual(v, max); }
  static IsWithin (v, min, max){ return Debug.IsGreaterThanOrEqual(v, min) && Debug.IsLessThanOrEqual(v, max); }
  static IsBetween(v, min, max){ return Debug.IsGreaterThan(v, min) && Debug.IsLessThan(v, max); }

  static IsLengthBetween(v, min, max){ return Debug.IsNumber(v.length) && Debug.IsBetween(v.length, min, max); }
  static IsLengthInRange(v, min, max){ return Debug.IsNumber(v.length) && Debug.IsInRange(v.length, min, max); }

  static IsOlderThan(v, date){ return Debug.IsDate(v) && Debug.IsDate(date) && v > date; }
  static IsYoungerThan(v, date){ return Debug.IsDate(v) && Debug.IsDate(date) && v < date; }
  static IsSameAge(v, date){ return Debug.IsDate(v) && Debug.IsDate(date) && v.getTime() === date.getTime(); }

  static IsThrowing(fn)
  {
    if (!Debug.IsFunction(fn)) return false;

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

  static IsResolving(fn)
  {
    if (!Debug.IsFunction(fn)) return false;
    return Promise.resolve(fn()).then(r => true).catch(e => false);
  }

  static IsRejecting(fn)
  {
    if (!Debug.IsFunction(fn)) return false;
    return Promise.resolve(fn()).then(r => false).catch(e => true);
  }

  static IsUpperCase(v){ return v.toUpperCase() === v; }
  static IsLowerCase(v){ return v.toLowerCase() === v; }
  static IsAllDigits(v){ return /^\d+$/.test(v); }

  static Includes(a, b){ return a.includes(b); }
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

  static Has(object, key){ return Debug.IsComplex(object) && Reflect.has(object, key); }
  static HasOwn(object, key){ return Debug.IsComplex(object) && Object.hasOwn(object, key); }
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
