import {Debug as D} from "/js/Utility/Debug.js";

export class Assertion
{
  constructor(tag, v)
  {
    // super();
    this.tag = tag;
    this.v = v;
  }

  Fail(reason)
  {
    throw new Error(`Tag ${this.tag.Identify()}'s assertion failed because ${reason}`);
  }

  Try(value)
  {
    if (value === true)
    {
      return this;
    }
    else
    {
      return undefined;
    }
  }

  IsDefined(){ return this.Try(D.Defined(this.v)) ?? this.Fail(`${this.v} is not defined`); }
  IsTrue(){ return this.Try(D.True(this.v)) ?? this.Fail(`${this.v} is not true`); }
  IsFalse(){ return this.Try(D.False(this.v)) ?? this.Fail(`${this.v} is not false`); }
  IsTruthy(){ return this.Try(D.Truthy(this.v)) ?? this.Fail(`${this.v} is not truthy`); }
  IsFalsy(){ return this.Try(D.Falsy(this.v)) ?? this.Fail(`${this.v} is not falsy`); }
  IsUndefined(){ return this.Try(D.Undefined(this.v)) ?? this.Fail(`${this.v} is not undefined`); }
  IsNull     (){ return this.Try(D.Null(this.v)) ?? this.Fail(`${this.v} is not null`); }
  IsString   (){ return this.Try(D.String(this.v)) ?? this.Fail(`${this.v} is not a String`); }
  IsNumber   (){ return this.Try(D.Number(this.v)) ?? this.Fail(`${this.v} is not a Number`); }
  IsFloat(){ return this.Try(D.Float(this.v)) ?? this.Fail(`${this.v} is not a Number`); }
  IsInt(){ return this.Try(D.Int(this.v)) ?? this.Fail(`${this.v} is not a Number`); }
  IsBoolean  (){ return this.Try(D.Boolean(this.v)) ?? this.Fail(`${this.v} is not a Boolean`); }
  IsFunction (){ return this.Try(D.Function(this.v)) ?? this.Fail(`${this.v} is not a Function`); }
  IsSymbol   (){ return this.Try(D.Symbol(this.v)) ?? this.Fail(`${this.v} is not a Symbol`); }
  IsObject   (){ return this.Try(D.Object(this.v)) ?? this.Fail(`${this.v} is not an Object`); }
  IsArray    (){ return this.Try(D.Array(this.v)) ?? this.Fail(`${this.v} is not an Array`); }
  IsDate     (){ return this.Try(D.Date(this.v)) ?? this.Fail(`${this.v} is not a Date`); }
  IsMap      (){ return this.Try(D.Map(this.v)) ?? this.Fail(`${this.v} is not a Map`); }
  IsWeakMap  (){ return this.Try(D.WeakMap(this.v)) ?? this.Fail(`${this.v} is not a WeakMap`); }
  IsSet      (){ return this.Try(D.Set(this.v)) ?? this.Fail(`${this.v} is not a Set`); }
  IsWeakSet  (){ return this.Try(D.WeakSet(this.v)) ?? this.Fail(`${this.v} is not a WeakSet`); }
  IsPromise  (){ return this.Try(D.Promise(this.v)) ?? this.Fail(`${this.v} is not a Promise`); }
  IsPrimitive(){ return this.Try(D.Primitive(this.v)) ?? this.Fail(`${this.v} is not a Primitive`); }
  IsUint8Array(){ return this.Try(D.Uint8Array(this.v)) ?? this.Fail(`${this.v} is not a Uint8Array`); }
  IsUint16Array(){ return this.Try(D.Uint16Array(this.v)) ?? this.Fail(`${this.v} is not a Uint16Array`); }
  IsUint32Array(){ return this.Try(D.Uint32Array(this.v)) ?? this.Fail(`${this.v} is not a Uint32Array`); }
  IsBigUint64Array(){ return this.Try(D.BigUint64Array(this.v)) ?? this.Fail(`${this.v} is not a BigUint64Array`); }
  IsInt8Array(){ return this.Try(D.Int8Array(this.v)) ?? this.Fail(`${this.v} is not an Int8Array`); }
  IsUint8Array(){ return this.Try(D.Uint8Array(this.v)) ?? this.Fail(`${this.v} is not a Uint8Array`); }
  IsUint8ClampedArray(){ return this.Try(D.Uint8ClampedArray(this.v)) ?? this.Fail(`${this.v} is not a Uint8ClampedArray`); }
  IsInt16Array(){ return this.Try(D.Int16Array(this.v)) ?? this.Fail(`${this.v} is not an Int16Array`); }
  IsUint16Array(){ return this.Try(D.Uint16Array(this.v)) ?? this.Fail(`${this.v} is not an Uint16Array`); }
  IsInt32Array(){ return this.Try(D.Int32Array(this.v)) ?? this.Fail(`${this.v} is not an Int32Array`); }
  IsUint32Array(){ return this.Try(D.Uint32Array(this.v)) ?? this.Fail(`${this.v} is not a Uint32Array`); }
  IsFloat32Array(){ return this.Try(D.Float32Array(this.v)) ?? this.Fail(`${this.v} is not a Float32Array`); }
  IsFloat64Array(){ return this.Try(D.Float64Array(this.v)) ?? this.Fail(`${this.v} is not a Float64Array`); }
  IsBigInt64Array(){ return this.Try(D.BigInt64Array(this.v)) ?? this.Fail(`${this.v} is not a BigInt64Array`); }
  IsBigUint64Array(){ return this.Try(D.BigUint64Array(this.v)) ?? this.Fail(`${this.v} is not a BigUint64Array`); }

  IsOptionalString(){ return this.Try(D.OptionalString(this.v)) ?? this.Fail(`${this.v} is not undefined or a String`); }
  IsOptionalNumber(){ return this.Try(D.OptionalNumber(this.v)) ?? this.Fail(`${this.v} is not undefined or a Number`); }
  IsOptionalBoolean(){ return this.Try(D.OptionalBoolean(this.v)) ?? this.Fail(`${this.v} is not undefined or a Boolean`); }
  IsOptionalFunction(){ return this.Try(D.OptionalFunction(this.v)) ?? this.Fail(`${this.v} is not undefined or a Function`); }
  IsOptionalSymbol(){ return this.Try(D.OptionalSymbol(this.v)) ?? this.Fail(`${this.v} is not undefined or a Symbol`); }
  IsOptionalObject(){ return this.Try(D.OptionalObject(this.v)) ?? this.Fail(`${this.v} is not undefined or a Object`); }
  IsOptionalArray(){ return this.Try(D.OptionalArray(this.v)) ?? this.Fail(`${this.v} is not undefined or a Array`); }
  IsOptionalNull(){ return this.Try(D.OptionalNull(this.v)) ?? this.Fail(`${this.v} is not undefined or a Null`); }

  Inherits(i){ return this.Try(D.InstanceOf(this.v, i)) ?? this.Fail(`${this.v} does not inherit ${i?.name}`); }
}
