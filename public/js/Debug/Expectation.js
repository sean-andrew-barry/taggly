import {Debug} from "/js/Debug/Debug.js";
import {ObjectUtilities} from "/js/Utility/Object.js";
// import {SIZE_OF} from "/js/Utility/Globals.js";

export class ExpectationError extends Error
{
  constructor(expectation, message, format = true)
  {
    if (format === true)
    {
      if (expectation.GetState() === true)
      {
        message = `Expected "${expectation.GetName()}" to ${message}`;
      }
      else
      {
        message = `Expected "${expectation.GetName()}" to NOT ${message}`;
      }
    }

    super(message);
    this.expectation = expectation;
  }
}

export class ExpectedOnServer extends ExpectationError
{
  constructor(e){ super(e, `to be running on the server, not the client`); }
}

export class ExpectedOnClient extends ExpectationError
{
  constructor(e){ super(e, `to be running on the client, not the server`); }
}

export class ExpectedDefined extends ExpectationError
{
  constructor(e){ super(e, `Expected ${e.GetName()} to be defined`); }
}

export class ExpectedTrue extends ExpectationError
{
  constructor(e){ super(e, `be true`); }
}

export class ExpectedFalse extends ExpectationError
{
  constructor(e){ super(e, `be false`); }
}

export class ExpectedTruthy extends ExpectationError
{
  constructor(e){ super(e, `be truthy`); }
}

export class ExpectedFalsy extends ExpectationError
{
  constructor(e){ super(e, `be falsy`); }
}

export class ExpectedUndefined extends ExpectationError
{
  constructor(e){ super(e, `be undefined`); }
}

export class ExpectedNull extends ExpectationError
{
  constructor(e){ super(e, `be null`); }
}

export class ExpectedString extends ExpectationError
{
  constructor(e){ super(e, `be a string`); }
}

export class ExpectedNumber extends ExpectationError
{
  constructor(e){ super(e, `be a number`); }
}

export class ExpectedBoolean extends ExpectationError
{
  constructor(e){ super(e, `be a boolean`); }
}

export class ExpectedFunction extends ExpectationError
{
  constructor(e){ super(e, `be a function`); }
}

export class ExpectedSymbol extends ExpectationError
{
  constructor(e){ super(e, `be a symbol`); }
}

export class ExpectedObject extends ExpectationError
{
  constructor(e){ super(e, `be an object`); }
}

export class ExpectedArray extends ExpectationError
{
  constructor(e){ super(e, `be an array`); }
}

export class ExpectedDate extends ExpectationError
{
  constructor(e){ super(e, `be a date`); }
}

export class ExpectedMap extends ExpectationError
{
  constructor(e){ super(e, `be a map`); }
}

export class ExpectedWeakMap extends ExpectationError
{
  constructor(e){ super(e, `bea weak map`); }
}

export class ExpectedSet extends ExpectationError
{
  constructor(e){ super(e, `be set`); }
}

export class ExpectedWeakSet extends ExpectationError
{
  constructor(e){ super(e, `be a weak set`); }
}

export class ExpectedPromise extends ExpectationError
{
  constructor(e){ super(e, `be a promise`); }
}

export class ExpectedInt8Array extends ExpectationError
{
  constructor(e){ super(e, `be a Int8Array`); }
}

export class ExpectedUint8Array extends ExpectationError
{
  constructor(e){ super(e, `be a Uint8Array`); }
}

export class ExpectedUint8ClampedArray extends ExpectationError
{
  constructor(e){ super(e, `be a Uint8ClampedArray`); }
}

export class ExpectedInt16Array extends ExpectationError
{
  constructor(e){ super(e, `be a Int16Array`); }
}

export class ExpectedUint16Array extends ExpectationError
{
  constructor(e){ super(e, `be a Uint16Array`); }
}

export class ExpectedInt32Array extends ExpectationError
{
  constructor(e){ super(e, `be a Int32Array`); }
}

export class ExpectedUint32Array extends ExpectationError
{
  constructor(e){ super(e, `be a Uint32Array`); }
}

export class ExpectedFloat32Array extends ExpectationError
{
  constructor(e){ super(e, `be a Float32Array`); }
}

export class ExpectedFloat64Array extends ExpectationError
{
  constructor(e){ super(e, `be a Float64Array`); }
}

export class ExpectedBigInt64Array extends ExpectationError
{
  constructor(e){ super(e, `be a BigInt64Array`); }
}

export class ExpectedBigUint64Array extends ExpectationError
{
  constructor(e){ super(e, `be a BigUint64Array`); }
}

export class ExpectedPrimitive extends ExpectationError
{
  constructor(e){ super(e, `be a primitive (string, number, symbol, or boolean)`); }
}

export class ExpectedValidString extends ExpectationError
{
  constructor(e){ super(e, `be a valid string (having one or more characters)`); }
}

export class ExpectedValidNumber extends ExpectationError
{
  constructor(e){ super(e, `be a valid number (not zero)`); }
}

export class ExpectedValidArray extends ExpectationError
{
  constructor(e){ super(e, `be a valid array (having one or more elements)`); }
}

export class ExpectedValidObject extends ExpectationError
{
  constructor(e){ super(e, `be a valid object (having one or more keys)`); }
}

export class ExpectedOptionalString extends ExpectationError
{
  constructor(e){ super(e, `be a string or undefined, but got "${e.GetType()}"`); }
}

export class ExpectedOptionalNumber extends ExpectationError
{
  constructor(e){ super(e, `be a number or undefined, but got "${e.GetType()}"`); }
}

export class ExpectedOptionalBoolean extends ExpectationError
{
  constructor(e){ super(e, `be a boolean or undefined, but got "${e.GetType()}"`); }
}

export class ExpectedOptionalFunction extends ExpectationError
{
  constructor(e){ super(e, `be a function or undefined, but got "${e.GetType()}"`); }
}

export class ExpectedOptionalSymbol extends ExpectationError
{
  constructor(e){ super(e, `be a symbol or undefined, but got "${e.GetType()}"`); }
}

export class ExpectedOptionalObject extends ExpectationError
{
  constructor(e){ super(e, `be an object or undefined, but got "${e.GetType()}"`); }
}

export class ExpectedOptionalArray extends ExpectationError
{
  constructor(e){ super(e, `be an array or undefined, but got "${e.GetType()}"`); }
}

export class ExpectedOptionalNull extends ExpectationError
{
  constructor(e){ super(e, `be null or undefined, but got "${e.GetType()}"`); }
}

export class ExpectedGreaterThan extends ExpectationError
{
  constructor(e){ super(e, `be greater than ${e.GetRight()}, but got ${e.GetValue()}`); }
}

export class ExpectedGreaterThanOrEqual extends ExpectationError
{
  constructor(e){ super(e, `be greater than or equal to ${e.GetRight()}, but got ${e.GetValue()}`); }
}

export class ExpectedLessThan extends ExpectationError
{
  constructor(e){ super(e, `be less than ${e.GetRight()}, but got ${e.GetValue()}`); }
}

export class ExpectedLessThanOrEqual extends ExpectationError
{
  constructor(e){ super(e, `be less than or equal to ${e.GetRight()}, but got ${e.GetValue()}`); }
}

export class ExpectedSameAs extends ExpectationError
{
  constructor(e){ super(e, `be the same as ${e.GetRight()}, but got ${e.GetLeft()}`); }
}

export class ExpectedEqual extends ExpectationError
{
  constructor(e){ super(e, `be equal to ${e.GetRight()}, but got ${e.GetLeft()}`); }
}

export class ExpectedCloseTo extends ExpectationError
{
  constructor(e){ super(e, `be close to ${e.GetRight()}, but got ${e.GetLeft()}`); }
}

export class ExpectedLength extends ExpectationError
{
  constructor(e){ super(e, `have length ${e.GetRight()}, but got ${e.GetLeft().length}`); }
}

export class ExpectedLongerThan extends ExpectationError
{
  constructor(e){ super(e, `be longer than ${e.GetRight()}, but got ${e.GetLeft().length}`); }
}

export class ExpectedShorterThan extends ExpectationError
{
  constructor(e){ super(e, `be shorter than ${e.GetRight()}, but got ${e.GetLeft().length}`); }
}

export class ExpectedMatch extends ExpectationError
{
  constructor(e){ super(e, `be match ${e.GetRight()}, but got ${e.GetLeft()}`); }
}

export class ExpectedInstanceOf extends ExpectationError
{
  constructor(e){ super(e, `be an instance of ${e.GetRight().name}, but got ${e.GetLeft()}`); }
}

export class ExpectedExtend extends ExpectationError
{
  constructor(e, l, r){ super(e, `be a class that extends ${r.name}`); }
}

export class ExpectedExclude extends ExpectationError
{
  constructor(e, r){ super(e, `exclude ${r}`); }
}

export class ExpectedInclude extends ExpectationError
{
  constructor(e, l, r){ super(e, `include ${r}`); }
}

export class ExpectedSmallerThan extends ExpectationError
{
  constructor(e, value, bytes, size){ super(e, `be smaller than ${bytes} bytes, but it was ${size} bytes`); }
}

export class ExpectedOlderThan extends ExpectationError
{
  constructor(e, l, r){ super(e, `be older than ${r}, but it was ${l}`); }
}

export class ExpectedYoungerThan extends ExpectationError
{
  constructor(e, l, r){ super(e, `be younger than ${r}, but it was ${l}`); }
}

export class ExpectedThrow extends ExpectationError
{
  constructor(e, l){ super(e, `to throw an error`); }
}

export class ExpectedResolve extends ExpectationError
{
  constructor(e, l){ super(e, `to resolve`); }
}

export class ExpectedReject extends ExpectationError
{
  constructor(e, l){ super(e, `to reject`); }
}

export class ExpectedKey extends ExpectationError
{
  constructor(e, l, r){ super(e, `to have the key "${r}"`); }
}

export class ExpectedValidKey extends ExpectationError
{
  constructor(e, l, r){ super(e, `to have a valid key for "${r}", but got ${l}`); }
}

export class Expectation
{
  constructor(owner, left)
  {
    this.owner = owner;
    this.left = left;
    this.state = true;
  }

  // And(key, fn)
  // {
  //   const expectation = new this.constructor(this.owner, this.left[key]);
  //   expectation.Named(key);
  //   expectation.SetState(this.state);
  //   fn.call(this, this, key);
  //   return this;
  // }

  And(key)
  {
    this.SetLeft(this.left[key]);
    return this;
  }

  And(value)
  {
    this.SetLeft(value);
    return this;
  }

  GetOwnerName()
  {
    if (this.owner && typeof(this.owner.GetName) === "function")
    {
      if (!this.method_name) return this.owner.GetName();
      else return `${this.owner.GetName()} in ${this.method_name}`;
    }

    return "";
  }

  SetLeft(left)
  {
    this.left = left;
    return this;
  }

  SetRight(right)
  {
    this.right = right;
    return this;
  }

  SetState(state)
  {
    this.state = state;
    return this;
  }

  SetName(name)
  {
    this.name = name;
    return this;
  }

  SetMethodName(method_name)
  {
    this.method_name = method_name;
    return this;
  }

  Named(name)
  {
    return this.SetName(name);
  }

  In(method_name)
  {
    return this.SetMethodName(method_name);
  }

  GetOwner(){ return this.owner; }
  GetLeft(){ return this.left; }
  GetRight(){ return this.right; }
  GetState(){ return this.state; }
  GetName(){ return this.name || this.GetLeft(); }
  GetMethodName(){ return this.method_name; }

  Not()
  {
    this.state = !this.state;
    return this;
  }

  Force(new_state = true)
  {
    const state = this.state;
    this.state = new_state;
    return state;
  }

  Is(name, comp)
  {
    if (Debug[name](this.GetLeft(), comp) === this.GetState())
    {
      return this;
    }
    else
    {
      return undefined;
    }
  }

  Fail(error, ...args)
  {
    this.SetRight(args[0]);

    throw new error(this, this.left, ...args);
  }

  ToBeOnServer(e = ExpectedOnServer){ return this.Is("IsOnServer") || this.Fail(e); }
  ToBeOnClient(e = ExpectedOnClient){ return this.Is("IsOnClient") || this.Fail(e); }

  ToBeDefined(e = ExpectedDefined){ return this.Is("IsDefined") || this.Fail(e); }
  ToBeTrue   (e = ExpectedTrue){ return this.Is("IsTrue") || this.Fail(e); }
  ToBeFalse  (e = ExpectedFalse){ return this.Is("IsFalse") || this.Fail(e); }
  ToBeTruthy (e = ExpectedTruthy){ return this.Is("IsTruthy") || this.Fail(e); }
  ToBeFalsy  (e = ExpectedFalsy){ return this.Is("IsFalsy") || this.Fail(e); }

  ToBeUndefined(e = ExpectedUndefined){ return this.Is("IsUndefined") || this.Fail(e); }
  ToBeNull     (e = ExpectedNull){ return this.Is("IsNull") || this.Fail(e); }
  ToBeString   (e = ExpectedString){ return this.Is("IsString") || this.Fail(e); }
  ToBeNumber   (e = ExpectedNumber){ return this.Is("IsNumber") || this.Fail(e); }
  ToBeBoolean  (e = ExpectedBoolean){ return this.Is("IsBoolean") || this.Fail(e); }
  ToBeFunction (e = ExpectedFunction){ return this.Is("IsFunction") || this.Fail(e); }
  ToBeSymbol   (e = ExpectedSymbol){ return this.Is("IsSymbol") || this.Fail(e); }
  ToBeObject   (e = ExpectedObject){ return this.Is("IsObject") || this.Fail(e); }
  ToBeArray    (e = ExpectedArray){ return this.Is("IsArray") || this.Fail(e); }
  ToBeDate     (e = ExpectedDate){ return this.Is("IsDate") || this.Fail(e); }
  ToBeMap      (e = ExpectedMap){ return this.Is("IsMap") || this.Fail(e); }
  ToBeWeakMap  (e = ExpectedWeakMap){ return this.Is("IsWeakMap") || this.Fail(e); }
  ToBeSet      (e = ExpectedSet){ return this.Is("IsSet") || this.Fail(e); }
  ToBeWeakSet  (e = ExpectedWeakSet){ return this.Is("IsWeakSet") || this.Fail(e); }
  ToBePromise  (e = ExpectedPromise){ return this.Is("IsPromise") || this.Fail(e); }
  ToBePrimitive(e = ExpectedPrimitive){ return this.Is("IsPrimitive") || this.Fail(e); }
  ToBeUint8Array(e = ExpectedPrimitive){ return this.Is("IsPrimitive") || this.Fail(e); }
  ToBeUint16Array(e = ExpectedPrimitive){ return this.Is("IsPrimitive") || this.Fail(e); }
  ToBeUint32Array(e = ExpectedPrimitive){ return this.Is("IsPrimitive") || this.Fail(e); }
  ToBeBigUint64Array(e = ExpectedPrimitive){ return this.Is("IsPrimitive") || this.Fail(e); }
  ToBeInt8Array(e = ExpectedInt8Array){ return this.Is("IsInt8Array") || this.Fail(e); }
  ToBeUint8Array(e = ExpectedUint8Array){ return this.Is("IsUint8Array") || this.Fail(e); }
  ToBeUint8ClampedArray(e = ExpectedUint8ClampedArray){ return this.Is("IsUint8ClampedArray") || this.Fail(e); }
  ToBeInt16Array(e = ExpectedInt16Array){ return this.Is("IsInt16Array") || this.Fail(e); }
  ToBeUint16Array(e = ExpectedUint16Array){ return this.Is("IsUint16Array") || this.Fail(e); }
  ToBeInt32Array(e = ExpectedInt32Array){ return this.Is("IsInt32Array") || this.Fail(e); }
  ToBeUint32Array(e = ExpectedUint32Array){ return this.Is("IsUint32Array") || this.Fail(e); }
  ToBeFloat32Array(e = ExpectedFloat32Array){ return this.Is("IsFloat32Array") || this.Fail(e); }
  ToBeFloat64Array(e = ExpectedFloat64Array){ return this.Is("IsFloat64Array") || this.Fail(e); }
  ToBeBigInt64Array(e = ExpectedBigInt64Array){ return this.Is("IsBigInt64Array") || this.Fail(e); }
  ToBeBigUint64Array(e = ExpectedBigUint64Array){ return this.Is("IsBigUint64Array") || this.Fail(e); }

  ToBeValidString(e = ExpectedValidString){ return this.Is("IsValidString") || this.Fail(e); }
  ToBeValidNumber(e = ExpectedValidNumber){ return this.Is("IsValidNumber") || this.Fail(e); }
  ToBeValidArray (e = ExpectedValidArray ){ return this.Is("IsValidArray" ) || this.Fail(e); }
  ToBeValidObject(e = ExpectedValidObject){ return this.Is("IsValidObject") || this.Fail(e); }

  ToBeOptionalString(e = ExpectedOptionalString){ return this.Is("IsString") || this.Is("IsUndefined") || this.Fail(e); }
  ToBeOptionalNumber(e = ExpectedOptionalNumber){ return this.Is("IsNumber") || this.Is("IsUndefined") || this.Fail(e); }
  ToBeOptionalBoolean(e = ExpectedOptionalBoolean){ return this.Is("IsBoolean") || this.Is("IsUndefined") || this.Fail(e); }
  ToBeOptionalFunction(e = ExpectedOptionalFunction){ return this.Is("IsFunction") || this.Is("IsUndefined") || this.Fail(e); }
  ToBeOptionalSymbol(e = ExpectedOptionalSymbol){ return this.Is("IsSymbol") || this.Is("IsUndefined") || this.Fail(e); }
  ToBeOptionalObject(e = ExpectedOptionalObject){ return this.Is("IsObject") || this.Is("IsUndefined") || this.Fail(e); }
  ToBeOptionalArray(e = ExpectedOptionalArray){ return this.Is("IsArray") || this.Is("IsUndefined") || this.Fail(e); }
  ToBeOptionalNull(e = ExpectedOptionalNull){ return this.Is("IsNull") || this.Is("IsUndefined") || this.Fail(e); }

  ToBeGreaterThan(v, e = ExpectedGreaterThan){ return this.Is("IsGreaterThan", v) || this.Fail(e, v); }
  ToBeGreaterThanOrEqual(v, e = ExpectedGreaterThanOrEqual){ return this.Is("IsGreaterThanOrEqual", v) || this.Fail(e, v); }
  ToBeLessThan(v, e = ExpectedLessThan){ return this.Is("IsLessThan", v) || this.Fail(e, v); }
  ToBeLessThanOrEqual(v, e = ExpectedLessThanOrEqual){ return this.Is("IsLessThanOrEqual", v) || this.Fail(e, v); }

  ToBeSameAs       (v, e = ExpectedSameAs){ return this.Is("IsSame", v) || this.Fail(e, v); }
  ToEqual          (v, e = ExpectedEqual){ return this.Is("IsEqual", v) || this.Fail(e, v); }
  ToBeCloseTo      (v, e = ExpectedCloseTo){ return this.Is("IsCloseTo", v) || this.Fail(e, v); }
  ToHaveLength     (v, e = ExpectedHaveLength){ return this.Is("IsLength", v) || this.Fail(e, v); }
  ToBeLongerThan   (v, e = ExpectedLongerThan){ return this.Is("IsLongerThan", v) || this.Fail(e, v); }
  ToBeShorterThan  (v, e = ExpectedShorterThan){ return this.Is("IsShorterThan", v) || this.Fail(e, v); }
  ToMatch          (v, e = ExpectedMatch){ return this.Is("IsMatch", v) || this.Fail(e, v); }
  ToBeInstanceOf   (v, e = ExpectedInstanceOf){ return this.Is("IsInstanceOf", v) || this.Fail(e, v); }
  ToExtend         (v, e = ExpectedExtend){ return this.Is("IsExtending", v) || this.Fail(e, v); }
  ToExclude        (v, e = ExpectedExclude){ return this.Is("IsExcluding", v) || this.Fail(e, v); }
  ToInclude        (v, e = ExpectedInclude){ return this.Is("IsIncluding", v) || this.Fail(e, v); }

  ToBeOlderThan(v, e = ExpectedOlderThan)
  {
    if (Debug.IsDate(v)) return this.Is("IsOlderThan", v) || this.Fail(e, v);
    return this;
  }

  ToBeYoungerThan(v, e = ExpectedYoungerThan)
  {
    if (Debug.IsDate(v)) return this.Is("IsYoungerThan", v) || this.Fail(e, v);
    return this;
  }

  ToBeSmallerThan(bytes, e = ExpectedSmallerThan)
  {
    // const size = global[SIZE_OF](this.left);
    const size = ObjectUtilities.SizeOf(this.left);
    if (Debug.IsNumber(bytes) && size >= bytes)
    {
      return this.Fail(e, bytes, size);
    }

    return this;
  }

  ToThrow(e = ExpectedThrow)
  {
    const state = this.Force(true);
    this.ToBeFunction();
    this.SetState(state);

    let threw = false;
    Promise.resolve(this.left())
    .catch(e =>
    {
      threw = true;
      // console.log("Caught error:", e);
    })
    .finally(() =>
    {
      if (threw !== this.state)
      {
        this.Fail(e);
      }
    });

    return this;
  }

  ToReject(e = ExpectedReject)
  {
    const state = this.Force(true);
    this.ToBePromise();
    this.SetState(state);

    return new Promise((resolve, reject) =>
    {
      this.left
      .then(r => reject(new e(this, this.left))) // Reject, because we WANT it to throw
      .catch(r => resolve(this)); // Resolve, because we WANT it to throw
    });
  }

  ToResolve(e = ExpectedResolve)
  {
    const state = this.Force(true);
    this.ToBePromise();
    this.SetState(state);

    return new Promise((resolve, reject) =>
    {
      this.left
      .then(r => resolve(this))
      .catch(r => reject(new e(this, this.left)));
    });
  }

  ToHaveKey(k, e = ExpectedKey){ return this.Is("HasOwn", k) || this.Fail(e, k); }
  ToHaveValidKey(k, e = ExpectedValidKey){ return this.Is("HasValidKey", k) || this.Fail(e, k); }
}
