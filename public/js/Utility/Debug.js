import {Environment} from "/js/Environment.js";

// The GeneratorFunction is not a global object, so this is a way to obtain it
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/GeneratorFunction
export const GeneratorFunction = Object.getPrototypeOf(function*(){}).constructor;
export const SEEN = new WeakSet();

const U = undefined;

export class Debug
{
  static GlobalThis(v){ return v === globalThis; }
  static Undefined(v){ return v === undefined; }
  static Null(v){ return v === null; }
  static NotDefined(v){ return (v === undefined) || (v === null); }
  static Defined(v){ return (v !== undefined) && (v !== null); }
  static Infinity(v){ return v === Infinity; }
  static True(v){ return v === true; }
  static False(v){ return v === false; }
  static Truthy(v){ return v ? true : false; }
  static Falsy(v){ return v ? false : true; }
  static OnServer(v){ return Environment.IsServer() === true; }
  static OnClient(v){ return Environment.IsClient() === true; }
  static InlineFrame(v){ return Environment.IsInlineFrame() === true; }

  static Primitive(v)
  {
    switch (typeof(v))
    {
      case "string" :
      case "number" :
      case "symbol" :
      case "boolean":
      {
        return true;
      }
    }

    return false;
  }

  static Number       (v){ return (typeof(v) === "number") && (!Number.isNaN(v)); }
  static NaN          (v){ return Number.isNaN(v); }
  static Infinite     (v){ return !Number.isFinite(v); }
  static Finite       (v){ return Number.isFinite(v); }
  static MaxSafeInt   (v){ return (v === Number.MAX_SAFE_INTEGER); }
  static MinSafeInt   (v){ return (v === Number.MIN_SAFE_INTEGER); }
  static MaxNumber    (v){ return (v === Number.MAX_VALUE); }
  static MinNumber    (v){ return (v === Number.MIN_VALUE); }
  static Float        (v){ return Debug.Number(v) && (v % 1 !== 0); }
  static Int          (v){ return Debug.Number(v) && (v % 1 === 0); }
  static Function     (v){ return (typeof(v) === "function"); }
  static Symbol       (v){ return (typeof(v) === "symbol"); }
  static Boolean      (v){ return (typeof(v) === "boolean"); }
  static String       (v){ return (typeof(v) === "string"); }
  static Object       (v){ return (v !== null) && (typeof(v) === "object"); }
  static Node         (v){ return (v instanceof window.Node); }
  static Element      (v){ return (v instanceof window.Element); }
  static RegExp       (v){ return (v instanceof RegExp); }
  static Promise      (v){ return (v instanceof Promise); }
  static Array        (v){ return (v instanceof Array); }
  static Int8Array    (v){ return (v instanceof Int8Array); }
  static Uint8Array   (v){ return (v instanceof Uint8Array); }
  static Uint8ClampedArray(v){ return (v instanceof Uint8ClampedArray); }
  static Int16Array   (v){ return (v instanceof Int16Array); }
  static Uint16Array  (v){ return (v instanceof Uint16Array); }
  static Int32Array   (v){ return (v instanceof Int32Array); }
  static Uint32Array  (v){ return (v instanceof Uint32Array); }
  static Float32Array (v){ return (v instanceof Float32Array); }
  static Float64Array (v){ return (v instanceof Float64Array); }
  static BigInt64Array (v){ return (v instanceof BigInt64Array); }
  static BigUint64Array(v){ return (v instanceof BigUint64Array); }
  static ArrayBuffer  (v){ return (v instanceof ArrayBuffer); }
  static Error        (v){ return (v instanceof Error); }
  static TypeError    (v){ return (v instanceof TypeError); }
  static BigInt       (v){ return (v instanceof BigInt); }
  static Date         (v){ return (v instanceof Date); }
  static Map          (v){ return (v instanceof Map); }
  static WeakMap      (v){ return (v instanceof WeakMap); }
  static Set          (v){ return (v instanceof Set); }
  static WeakSet      (v){ return (v instanceof WeakSet); }
  static Proxy        (v){ return (v instanceof Proxy); }
  static Generator    (v){ return (v instanceof Generator); }
  static GeneratorFunction(v){ return (v instanceof GeneratorFunction); }
  static Iterable     (v){ return Debug.Object(v) && Debug.Function(v[Symbol.iterator]); }
  static ObjectLiteral(v){ return Debug.Object(v) && (v.constructor === Object); }
  static ObjectEmpty  (v){ return Debug.Object(v) && Object.keys(v).length === 0; }
  static Class        (v){ return Debug.Object(v) && Debug.Function(v.constructor) && (v.constructor !== Object); }
  static Class        (v){ return Debug.Function(v) && (v !== Object) && Debug.InstanceOf(v.prototype, Object); }

  static OptionalString(v){ return v === undefined || Debug.String(v); }
  static OptionalNumber(v){ return v === undefined || Debug.Number(v); }
  static OptionalBoolean(v){ return v === undefined || Debug.Boolean(v); }
  static OptionalFunction(v){ return v === undefined || Debug.Function(v); }
  static OptionalSymbol(v){ return v === undefined || Debug.Symbol(v); }
  static OptionalObject(v){ return v === undefined || Debug.Object(v); }
  static OptionalArray(v){ return v === undefined || Debug.Array(v); }
  static OptionalNull(v){ return v === undefined || Debug.Null(v); }

  // An easy way to test if an object has been viewed before in some sort of algorithm
  static Seen(v, seen = SEEN)
  {
    if (!Debug.Object(v)) return false;
    else if (seen.has(v)) return true;

    seen.add(v);
    return false;
  }

  static ValidString(v){ return Debug.String(v) && v.length > 0; }
  static ValidNumber(v){ return Debug.Number(v) && v > 0; }
  static ValidArray (v){ return Debug.Array (v) && v.length > 0; }
  static ValidObject(v){ return Debug.Object(v) && Object.keys(v).length > 0; }

  static InstanceOf (a, b){ return (a instanceof b); }
  static ConstructorOf(a, b){ return Debug.Function(a) && Debug.InstanceOf(a.prototype, b); }
  static Extending(a, b){ return Debug.Function(a) && Debug.InstanceOf(a.prototype, b); }
  static ChildOf    (a, b){ return (a instanceof b) && Debug.Function(a.constructor) && (a.constructor !== b); }
  static CloseTo    (a, b, r = 0.001){ return Debug.Number(a) && Debug.Number(b) && (Math.abs(a - b) <= r); }
  static Match      (a, b){ return Debug.String(a) && Debug.RegExp(b) && (a.match(b) !== null); }
  static Length     (a, b){ return Debug.Number(a.length) && Debug.Number(b) && (a.length === b); }
  static LongerThan (a, b){ return Debug.Number(a.length) && Debug.Number(b) && (a.length > b); }
  static ShorterThan(a, b){ return Debug.Number(a.length) && Debug.Number(b) && (a.length < b); }
  static Same       (a, b){ return Object.is(a, b); }
  static Equal      (a, b){ return (a === b); }
  static Type       (a, b){ return (typeof(a) === b); }

  static GreaterThan       (a, b){ return Debug.Number(a) && Debug.Number(b) && a >  b; }
  static GreaterThanOrEqual(a, b){ return Debug.Number(a) && Debug.Number(b) && a >= b; }
  static LessThan          (a, b){ return Debug.Number(a) && Debug.Number(b) && a <  b; }
  static LessThanOrEqualTo (a, b){ return Debug.Number(a) && Debug.Number(b) && a <= b; }

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
