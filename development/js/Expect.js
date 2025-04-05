import {Debug, Debug as D} from "/js/Debug/Debug.js";

export class Expect extends Debug
{
  static Module(fn){ return new Module(undefined, fn); }
  static Function(fn){ return new Function(undefined, fn); }
  static Parameter(fn){ return new Parameter(undefined, fn); }
  static Test(value){ return new Test(undefined, value); }

  constructor(parent, value)
  {
    super();
    
    this.#parent = parent;
    this.#value = value;
  }

  #parent;
  #name;
  #value;
  #state = true;

  GetParent(){ return this.#parent; }
  GetValue(){ return this.#value; }
  GetName(){ return this.GetValue().toString(); }
  GetParentName(){ return this.GetParent()?.GetName(); }
  Not(){ this.#state = !this.#state; return this; }

  Named(name){ this.#name = name; return this; }
  Module(url){ return new Module(this, url); }
  Function(fn){ return new Function(this, fn); }
  Return(result){ return new Return(this, result); }
  Value(value){ return new Value(this, value); }
  Class(ctor){ return new Class(this, ctor); }
  String(value){ return new String(this, value); }
  Number(value){ return new Number(this, value); }

  Error(message)
  {
    if (this.#parent)
    {
      return this.#parent.Error(message);
    }

    return new Error(message);
  }

  TypeOf(value = this.#value)
  {
    switch (typeof(value))
    {
      case "function": return value.name;
      
      case "string":
      case "boolean":
      case "number":
      case "bigint":
      case "symbol":
      case "undefined": return typeof(value);

      case "object":
      {
        if (value === null) return "null";
        else return value?.name ?? value?.constructor?.name ?? "object";
      }

      default: throw new Error(`Unknown type "${typeof(value)}"`);
    }
  }

  Throw(string)
  {
    throw new Error(string);
  }

  ThrowType(string)
  {
    return this.Throw(`be ${string}, not ${this.TypeOf(this.#value)}`);
  }

  ThrowHave(string)
  {
    return this.Throw(`have ${string}`);
  }

  ThrowBe(string, value)
  {
    return this.Throw(`be ${string}`);
  }

  Unary(test)
  {
    if (test.call(this.constructor, this.#value) !== this.#state)
    {
      return undefined;
    }
    else
    {
      this.#state = true;
      return this;
    }
  }

  Binary(test, value)
  {
    if (typeof(test) === "string")
    {
      if (this.constructor[test](this.#value, value) !== this.#state)
      {
        return undefined;
      }
      else
      {
        this.#state = true;
        return this;
      }
    }

    if (test.call(this.constructor, this.#value, value) !== this.#state)
    {
      return undefined;
    }
    else
    {
      this.#state = true;
      return this;
    }
  }

  ToBeUndefined(){ return this.Unary(D.IsUndefined) ?? this.ThrowType(`undefined`); }
  ToBeNull     (){ return this.Unary(D.IsNull) ?? this.ThrowType(`null`); }
  ToBeString   (){ return this.Unary(D.IsString) ?? this.ThrowType(`a string`); }
  ToBeNumber   (){ return this.Unary(D.IsNumber) ?? this.ThrowType(`a number`); }
  ToBeBoolean  (){ return this.Unary(D.IsBoolean) ?? this.ThrowType(`a boolean`); }
  ToBeFunction (){ return this.Unary(D.IsFunction) ?? this.ThrowType(`a function`); }
  ToBeSymbol   (){ return this.Unary(D.IsSymbol) ?? this.ThrowType(`a symbol`); }
  ToBeObject   (){ return this.Unary(D.IsObject) ?? this.ThrowType(`an object`); }
  ToBeArray    (){ return this.Unary(D.IsArray) ?? this.ThrowType(`an array`); }
  ToBeDate     (){ return this.Unary(D.IsDate) ?? this.ThrowType(`a Date`); }
  ToBeMap      (){ return this.Unary(D.IsMap) ?? this.ThrowType(`a Map`); }
  ToBeWeakMap  (){ return this.Unary(D.IsWeakMap) ?? this.ThrowType("a WeakMap"); }
  ToBeSet      (){ return this.Unary(D.IsSet) ?? this.ThrowType("a Set"); }
  ToBeWeakSet  (){ return this.Unary(D.IsWeakSet) ?? this.ThrowType("a WeakSet"); }
  ToBePromise  (){ return this.Unary(D.IsPromise) ?? this.ThrowType("a Promise"); }
  ToBePrimitive(){ return this.Unary(D.IsPrimitive) ?? this.ThrowType("a primitive"); }
  ToBeUint8Array(){ return this.Unary(D.IsPrimitive) ?? this.ThrowType("a Uint8Array"); }
  ToBeUint16Array(){ return this.Unary(D.IsPrimitive) ?? this.ThrowType("a Uint16Array"); }
  ToBeUint32Array(){ return this.Unary(D.IsPrimitive) ?? this.ThrowType("a Uint32Array"); }
  ToBeBigUint64Array(){ return this.Unary(D.IsPrimitive) ?? this.ThrowType("a BigUint64Array"); }
  ToBeInt8Array(){ return this.Unary(D.IsInt8Array) ?? this.ThrowType("a Int8Array"); }
  ToBeUint8Array(){ return this.Unary(D.IsUint8Array) ?? this.ThrowType("a Uint8Array"); }
  ToBeUint8ClampedArray(){ return this.Unary(D.IsUint8ClampedArray) ?? this.ThrowType("a Uint8ClampedArray"); }
  ToBeInt16Array(){ return this.Unary(D.IsInt16Array) ?? this.ThrowType("a Int16Array"); }
  ToBeUint16Array(){ return this.Unary(D.IsUint16Array) ?? this.ThrowType("a Uint16Array"); }
  ToBeInt32Array(){ return this.Unary(D.IsInt32Array) ?? this.ThrowType("a Int32Array"); }
  ToBeUint32Array(){ return this.Unary(D.IsUint32Array) ?? this.ThrowType("a Uint32Array"); }
  ToBeFloat32Array(){ return this.Unary(D.IsFloat32Array) ?? this.ThrowType("a Float32Array"); }
  ToBeFloat64Array(){ return this.Unary(D.IsFloat64Array) ?? this.ThrowType("a Float64Array"); }
  ToBeBigInt64Array(){ return this.Unary(D.IsBigInt64Array) ?? this.ThrowType("a BigInt64Array"); }
  ToBeBigUint64Array(){ return this.Unary(D.IsBigUint64Array) ?? this.ThrowType("a BigUint64Array"); }
  ToBeView(){ return this.Unary(D.IsView) ?? this.ThrowType(`a data view`); }
  ToBeClass(){ return this.Unary(D.IsClass) ?? this.ThrowType(`a class`); }

  ToBeStringOrView(){ return this.Unary(D.IsStringOrView) ?? this.ThrowType(`a string or a data view`); }
  ToBeOptionalString(){ return this.Unary(D.IsOptionalString) ?? this.ThrowType(`a string or undefined`); }
  ToBeOptionalNumber(){ return this.Unary(D.IsOptionalNumber) ?? this.ThrowType(`a number or undefined`); }
  ToBeOptionalBoolean(){ return this.Unary(D.IsOptionalBoolean) ?? this.ThrowType(`a boolean or undefined`); }
  ToBeOptionalFunction(){ return this.Unary(D.IsOptionalFunction) ?? this.ThrowType(`a function or undefined`); }
  ToBeOptionalSymbol(){ return this.Unary(D.IsOptionalSymbol) ?? this.ThrowType(`a symbol or undefined`); }
  ToBeOptionalObject(){ return this.Unary(D.IsOptionalObject) ?? this.ThrowType(`an object or undefined`); }
  ToBeOptionalArray(){ return this.Unary(D.IsOptionalArray) ?? this.ThrowType(`an array or undefined`); }
  ToBeOptionalNull(){ return this.Unary(D.IsOptionalNull) ?? this.ThrowType(`null or undefined`); }

  ToHaveProperty(v){ return this.Binary(D.Has, v) ?? this.ThrowHave(`property "${v}"`, v); }
  ToHaveOwnProperty(v){ return this.Binary(D.HasOwn, v) ?? this.ThrowHave(`own property "${v}"`, v); }
  ToBeInstanceOf(v){ return this.Binary(D.IsInstanceOf, v) ?? this.ThrowBe(`an instance of "${this.TypeOf(v)}"`); }
  ToEqual(v){ return this.Binary(D.IsEqual, v) ?? this.Throw(`be equal to "${this.TypeOf(v)}"`); }

  ToBeString(){ return this.String(this.#value); }
  ToBeNumber(){ return this.Number(this.#value); }
}

export class Module extends Expect
{
  GetName(){ return this.GetValue().name; }
}

export class Value extends Expect
{
  GetName(){ return this.GetValue().name; }

  Throw(message)
  {
    throw new Error(`${this.GetParentName()} expected value "${this.GetValue()}" to ${message}`);
  }
}

export class Class extends Value
{
  GetName(){ return this.GetValue().name; }

  Function(name){ return new Function(this, name); }
}

export class Function extends Value
{
  GetName(){ return this.GetValue().name; }

  Parameter(value){ return new Parameter(this, value); }

  Start(){}
  Stop(){}

  Throw(message){ throw new Error(`Function ${this.GetValue().name} was expected to ${message}`); }
}

export class Test extends Function
{
  // GetName(){ return "Test " + this.GetValue().name; }
  // GetName(){ return this.GetValue().name; }

  // Throw(message)
  // {
  //   throw new Error(`Test ${this.GetParentName()} expected its parameter "${this.GetName()}" to be ${message}`);
  // }

  Error(message){ return super.Error(`Test "${this.GetName()}" failed, because ${message}`); }
  Throw(message){ throw this.Error(`Test "${this.GetName()}" failed, because ${message}`); }
}

export class Parameter extends Value
{
  GetName(){ return this.GetValue(); }

  Throw(message)
  {
    throw new Error(`${this.GetParentName()} expected its parameter "${this.GetName()}" to be ${message}`);
  }
}

export class Return extends Value
{
  GetName(){ return this.GetValue(); }

  Throw(message)
  {
    throw new Error(`${this.GetParentName()} expected its return "${this.GetName()}" to be ${message}`);
  }
}

export class String extends Value
{
  static Longer(a, b){ return  a.length > b; }
  static Shorter(a, b){ return a.length < b; }
  static Includes(a, b){ return a.includes(b); }

  constructor(parent, value)
  {
    super(parent, value);
    this.Unary(D.IsString) ?? this.GetParent().Throw(`be a string, not "${this.TypeOf()}"`);
  }

  Throw(message){ throw this.Error(`String "${this.GetValue()}" was expected to ${message}`); }
  ToInclude(v){ return this.Binary("Includes", v) ?? this.Throw(`include the substring "${v}"`); }
  ToBeLongerThan(v){ return this.Binary("Longer", v) ?? this.Throw(`be longer than ${v} characters`); }
  ToBeShorterThan(v){ return this.Binary("Shorter", v) ?? this.Throw(`be shorter than ${v} characters`); }
}

export class Number extends Value
{
  static Larger(a, b){ return a > b; }
  static Smaller(a, b){ return a < b; }

  constructor(parent, value)
  {
    super(parent, value);
    this.Unary(D.IsNumber) ?? this.GetParent().Throw(`be a number, not "${this.TypeOf()}"`);
  }

  Throw(message){ throw this.Error(`Number "${this.GetValue()}" was expected to ${message}`); }
  ToBeLargerThan(v){ return this.Binary("Larger", v) ?? this.Throw(`be larger than "${v}"`); }
  ToBeSmallerThan(v){ return this.Binary("Smaller", v) ?? this.Throw(`be smaller than "${v}"`); }
}