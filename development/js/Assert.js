import {Debug as D} from "/js/Debug/Debug.js";
import {Error} from "/js/Error.js";

export class Assert
{
  static Throw(...args){ return Error.Throw(...args); }

  static GlobalThis(v){ return D.IsGlobalThis(v) ? this : undefined; }
  static Undefined(v){ return D.IsUndefined(v) ? this : undefined; }
  static Null(v){ return D.IsNull(v) ? this : undefined; }
  static Nullish(v){ return D.IsNullish(v) ? this : undefined; }
  static NotDefined(v){ return D.IsNotDefined(v) ? this : undefined; }
  static Defined(v){ return D.IsDefined(v) ? this : undefined; }
  static Infinity(v){ return D.IsInfinity(v) ? this : undefined; }
  static True(v){ return D.IsTrue(v) ? this : undefined; }
  static False(v){ return D.IsFalse(v) ? this : undefined; }
  static Truthy(v){ return D.IsTruthy(v) ? this : undefined; }
  static Falsy(v){ return D.IsFalsy(v) ? this : undefined; }
  static InlineFrame(){ return D.IsInlineFrame() ? this : undefined; }
  static Server(){ return D.IsServer() ? this : undefined; }
  static Client(){ return D.IsClient() ? this : undefined; }

  static Primitive    (v){ return D.IsPrimitive(v) ? this : undefined; }
  static Complex      (v){ return D.IsComplex(v) ? this : undefined; }
  static Simple       (v){ return D.IsSimple(v) ? this : undefined; }
  static Number       (v){ return D.IsNumber(v) ? this : undefined; }
  static NaN          (v){ return D.IsNaN(v) ? this : undefined; }
  static Infinite     (v){ return D.IsInfinite(v) ? this : undefined; }
  static Finite       (v){ return D.IsFinite(v) ? this : undefined; }
  static MaxSafeInt   (v){ return D.IsMaxSafeInt(v) ? this : undefined; }
  static MinSafeInt   (v){ return D.IsMinSafeInt(v) ? this : undefined; }
  static MaxNumber    (v){ return D.IsMaxNumber(v) ? this : undefined; }
  static MinNumber    (v){ return D.IsMinNumber(v) ? this : undefined; }
  static Float        (v){ return D.IsFloat(v) ? this : undefined; }
  static Int          (v){ return D.IsInt(v) ? this : undefined; }
  static Function     (v){ return D.IsFunction(v) ? this : undefined; }
  static Symbol       (v){ return D.IsSymbol(v) ? this : undefined; }
  static Boolean      (v){ return D.IsBoolean(v) ? this : undefined; }
  static String       (v){ return D.IsString(v) ? this : undefined; }
  static Object       (v){ return D.IsObject(v) ? this : undefined; }
  static Node         (v){ return D.IsNode(v) ? this : undefined; }
  static Element      (v){ return D.IsElement(v) ? this : undefined; }
  static RegExp       (v){ return D.IsRegExp(v) ? this : undefined; }
  static Promise      (v){ return D.IsPromise(v) ? this : undefined; }
  static Array        (v){ return D.IsArray(v) ? this : undefined; }
  static Int8Array    (v){ return D.IsInt8Array(v) ? this : undefined; }
  static Uint8Array   (v){ return D.IsUint8Array(v) ? this : undefined; }
  static Uint8ClampedArray(v){ return D.IsUint8ClampedArray(v) ? this : undefined; }
  static Int16Array   (v){ return D.IsInt16Array(v) ? this : undefined; }
  static Uint16Array  (v){ return D.IsUint16Array(v) ? this : undefined; }
  static Int32Array   (v){ return D.IsInt32Array(v) ? this : undefined; }
  static Uint32Array  (v){ return D.IsUint32Array(v) ? this : undefined; }
  static Float32Array (v){ return D.IsFloat32Array(v) ? this : undefined; }
  static Float64Array (v){ return D.IsFloat64Array(v) ? this : undefined; }
  static BigInt64Array (v){ return D.IsBigInt64Array(v) ? this : undefined; }
  static BigUint64Array(v){ return D.IsBigUint64Array(v) ? this : undefined; }
  static ArrayBuffer  (v){ return D.IsArrayBuffer(v) ? this : undefined; }
  static Error        (v){ return D.IsError(v) ? this : undefined; }
  static TypeError    (v){ return D.IsTypeError(v) ? this : undefined; }
  static BigInt       (v){ return D.IsBigInt(v) ? this : undefined; }
  static Date         (v){ return D.IsDate(v) ? this : undefined; }
  static Map          (v){ return D.IsMap(v) ? this : undefined; }
  static WeakMap      (v){ return D.IsWeakMap(v) ? this : undefined; }
  static Set          (v){ return D.IsSet(v) ? this : undefined; }
  static WeakSet      (v){ return D.IsWeakSet(v) ? this : undefined; }
  static Proxy        (v){ return D.IsProxy(v) ? this : undefined; }
  static Generator    (v){ return D.IsGenerator(v) ? this : undefined; }
  static GeneratorFunction(v){ return D.IsGeneratorFunction(v) ? this : undefined; }
  static Iterable     (v){ return D.IsIterable(v) ? this : undefined; }
  static ObjectLiteral(v){ return D.IsObjectLiteral(v) ? this : undefined; }
  static ObjectEmpty  (v){ return D.IsObjectEmpty(v) ? this : undefined; }
  static Class        (v){ return D.IsClass(v) ? this : undefined; }

  static OptionalString(v){ return D.IsOptionalString(v) ? this : undefined; }
  static OptionalNumber(v){ return D.IsOptionalNumber(v) ? this : undefined; }
  static OptionalBoolean(v){ return D.IsOptionalBoolean(v) ? this : undefined; }
  static OptionalFunction(v){ return D.IsOptionalFunction(v) ? this : undefined; }
  static OptionalSymbol(v){ return D.IsOptionalSymbol(v) ? this : undefined; }
  static OptionalObject(v){ return D.IsOptionalObject(v) ? this : undefined; }
  static OptionalArray(v){ return D.IsOptionalArray(v) ? this : undefined; }
  static OptionalNull(v){ return D.IsOptionalNull(v) ? this : undefined; }

  static View(v){ return D.IsView(v) ? this : undefined; }
  static StringOrView(v){ return D.IsStringOrView(v) ? this : undefined; }

  static ValidString(v){ return D.IsValidString(v) ? this : undefined; }
  static ValidNumber(v){ return D.IsValidNumber(v) ? this : undefined; }
  static ValidArray (v){ return D.IsValidArray (v) ? this : undefined; }
  static ValidObject(v){ return D.IsValidObject(v) ? this : undefined; }

  static InstanceOf (a, b){ return D.IsInstanceOf(a, b) ? this : undefined; }
  static ConstructorOf(a, b){ return D.IsConstructorOf(a, b) ? this : undefined; }
  static Extending(a, b){ return D.IsExtending(a, b) ? this : undefined; }
  static ChildOf    (a, b){ return D.IsChildOf(a, b) ? this : undefined; }
  static CloseTo    (a, b, r){ return D.IsCloseTo(a, b, r) ? this : undefined; }
  static Match      (a, b){ return D.IsMatch(a, b) ? this : undefined; }
  static Length     (a, b){ return D.IsLength(a, b) ? this : undefined; }
  static LongerThan (a, b){ return D.IsLongerThan(a, b) ? this : undefined; }
  static ShorterThan(a, b){ return D.IsShorterThan(a, b) ? this : undefined; }
  static Same       (a, b){ return D.IsSame(a, b) ? this : undefined; }
  static Equal      (a, b){ return D.IsEqual(a, b) ? this : undefined; }
  static Type       (a, b){ return D.IsType(a, b) ? this : undefined; }
  static Includes   (a, b){ return D.Includes(a, b) ? this : undefined; }

  static IsGreaterThan       (a, b){ return D.IsGreaterThan(a, b) ? this : undefined; }
  static IsGreaterThanOrEqual(a, b){ return D.IsGreaterThanOrEqual(a, b) ? this : undefined; }
  static IsLessThan          (a, b){ return D.IsLessThan(a, b) ? this : undefined; }
  static IsLessThanOrEqualTo (a, b){ return D.IsLessThanOrEqualTo(a, b) ? this : undefined; }

  static IsOlderThan(a, b){ return D.IsOlderThan(a, b) ? this : undefined; }
  static IsYoungerThan(a, b){ return D.IsYoungerThan(a, b) ? this : undefined; }
  static IsSameAge(a, b){ return D.IsSameAge(a, b) ? this : undefined; }

  static InRange(a, b, c){ return D.IsInRange(a, b, c) ? this : undefined; }
  static Within (a, b, c){ return D.IsWithin(a, b, c) ? this : undefined; }
  static Between(a, b, c){ return D.IsBetween(a, b, c) ? this : undefined; }
  static LengthBetween(a, b, c){ return D.IsLengthBetween(a, b, c) ? this : undefined; }
  static LengthInRange(a, b, c){ return D.IsLengthInRange(a, b, c) ? this : undefined; }

  static Throwing(v){ return D.IsThrowing(v) ? this : undefined; }
  static Resolving(v){ return D.IsResolving(v) ? this : undefined; }
  static Rejecting(v){ return D.IsRejecting(v) ? this : undefined; }

  static UpperCase(v){ return D.IsUpperCase(v) ? this : undefined; }
  static LowerCase(v){ return D.IsLowerCase(v) ? this : undefined; }
  static AllDigits(v){ return D.IsAllDigits(v) ? this : undefined; }

  static ContainsPattern(a, b, c){ return D.ContainsPattern(a, b, c) ? this : undefined; }
  static ContainsUpperCase(a, b){ return D.ContainsUpperCase(a, b) ? this : undefined; }
  static ContainsLowerCase(a, b){ return D.ContainsLowerCase(a, b) ? this : undefined; }
  static ContainsDigits(a, b){ return D.ContainsDigits(a, b) ? this : undefined; }
  static ContainsSpaces(a, b){ return D.ContainsSpaces(a, b) ? this : undefined; }
  static ContainsAlNums(a, b){ return D.ContainsAlNums(a, b) ? this : undefined; }
  static ContainsSymbols(a, b){ return D.ContainsSymbols(a, b) ? this : undefined; }
  static ContainsNonUpperCase(a, b){ return D.ContainsNonUpperCase(a, b) ? this : undefined; }
  static ContainsNonLowerCase(a, b){ return D.ContainsNonLowerCase(a, b) ? this : undefined; }
  static ContainsNonDigits(a, b){ return D.ContainsNonDigits(a, b) ? this : undefined; }
  static ContainsNonSpaces(a, b){ return D.ContainsNonSpaces(a, b) ? this : undefined; }
  static ContainsNonAlNums(a, b){ return D.ContainsNonAlNums(a, b) ? this : undefined; }
  static ContainsNonSymbols(a, b){ return D.ContainsNonSymbols(a, b) ? this : undefined; }
  static ContainsAnyUpperCase(a){ return D.ContainsAnyUpperCase(a) ? this : undefined; }
  static ContainsAnyLowerCase(b){ return D.ContainsAnyLowerCase(b) ? this : undefined; }

  static Has(a, b){ return D.Has(a, b) ? this : undefined; }
  static HasOwn(a, b){ return D.HasOwn(a, b) ? this : undefined; }
  static HasKey(a, b){ return D.HasKey(a, b) ? this : undefined; }
  static HasValidKey(a, b){ return D.HasValidKey(a, b) ? this : undefined; }
  static HasKeyCount(a, b){ return D.HasKeyCount(a, b) ? this : undefined; }

  static HasElement(a, b){ return D.HasElement(a, b) ? this : undefined; }
}