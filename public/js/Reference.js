import { Cyrb } from "/js/External/HashCyrb53.js";

const REFERENCES = new Map();
// const INSTANCES = new Map();
const NAMES = new Map();
const CODES = new Map();
const HASHES = new Map();

const VALUE = Symbol("value"); // The actual value itself
const SYMBOL = Symbol("symbol"); // A symbol unique identifier for in-memory
const TYPE = Symbol("type"); // A boolean for if it's a type (class) or an instance
const NAME = Symbol("name"); // The exported name with the aggregate module name, like Tags.Div
const CODE = Symbol("code"); // The order dependent identifier
const HASH = Symbol("hash"); // The order independent hash code, based on the name

let code = 1; // A 0 code means it isn't set, so count from 1
let fingerprint = 0;

export class Reference
{
  // Static method to get or create a Reference
  static Get(value)
  {
    // If the reference already exists, return it
    if (REFERENCES.has(value))
    {
      return REFERENCES.get(value);
    }

    // Create a new Reference, cache it, and return it
    const reference = new this(value);
    REFERENCES.set(value, reference);
    return reference;
  }

  static For(value)
  {
    // If the reference already exists, return it
    if (REFERENCES.has(value))
    {
      return REFERENCES.get(value);
    }

    // Create a new Reference, cache it, and return it
    const reference = new this(value);
    REFERENCES.set(value, reference);
    return reference;
  }

  // Find a reference type for a given value
  static TypeOf(value)
  {
    const ref = this.FromValue(value);
    if (ref)
    {
      if (ref.IsInstance())
      {
        return this.FromValue(ref.GetType());
      }
      else
      {
        return ref;
      }
    }

    switch (typeof value)
    {
      case "undefined": return this.FromName("Natives.Undefined");
      case "string": return this.FromName("Natives.String");
      case "number": return this.FromName("Natives.Number");
      case "bigint": return this.FromName("Natives.BigInt");
      case "boolean": return this.FromName("Natives.Boolean");
      case "symbol": return this.FromName("Natives.Symbol");
      case "function": return this.FromName("Natives.Function");
      case "object":
        if (value === null) return this.FromName("Natives.Null");

        const current = globalThis.Object.getPrototypeOf(value);
        switch (current)
        {
          case globalThis.Object: return this.FromName("Natives.Object");
          case globalThis.Array: return this.FromName("Natives.Array");
          case globalThis.RegExp: return this.FromName("Natives.RegExp");
          case globalThis.Promise: return this.FromName("Natives.Promise");
          case globalThis.Map: return this.FromName("Natives.Map");
          case globalThis.Set: return this.FromName("Natives.Set");
          case globalThis.Error: return this.FromName("Natives.Error");
          case globalThis.Date: return this.FromName("Natives.Date");
          case globalThis.URL: return this.FromName("Natives.URL");
          case globalThis.Blob: return this.FromName("Natives.Blob"); // TODO
          case globalThis.Int8Array: return this.FromName("Natives.Int8Array");
          case globalThis.Uint8Array: return this.FromName("Natives.Uint8Array");
          case globalThis.Uint8ClampedArray: return this.FromName("Natives.Uint8ClampedArray");
          case globalThis.Int16Array: return this.FromName("Natives.Int16Array");
          case globalThis.Uint16Array: return this.FromName("Natives.Uint16Array");
          case globalThis.Int32Array: return this.FromName("Natives.Int32Array");
          case globalThis.Uint32Array: return this.FromName("Natives.Uint32Array");
          case globalThis.Float32Array: return this.FromName("Natives.Float32Array");
          case globalThis.Float64Array: return this.FromName("Natives.Float64Array");
          case globalThis.BigInt64Array: return this.FromName("Natives.BigInt64Array");
          case globalThis.BigUint64Array: return this.FromName("Natives.BigUint64Array");
          default: return this.TypeOf(current); // Iterate up the prototypes hunting for one that's known
        }
      default: throw new Error(`Unknown value type "${typeof value}"`);
    }
  }

  static FromValue(value) { return REFERENCES.get(value); } // Get without auto creation
  static FromName(name) { return NAMES.get(name); }
  static FromCode(code) { return CODES.get(code); }
  static FromHash(hash) { return HASHES.get(hash); }

  static HasValue(value) { return REFERENCES.has(value); }
  static HasName(name) { return NAMES.has(name); }
  static HasCode(code) { return CODES.has(code); }
  static HasHash(hash) { return HASHES.has(hash); }

  static GetTypeFrom(value)
  {
    if (value === null) return Null;
    if (REFERENCES.has(value)) return REFERENCES.get(value);
    const current = Object.getPrototypeOf(value);

    switch (current)
    {
      case globalThis.Array: return this.FromName("Natives.Array");
      case globalThis.Promise: return this.FromName("Natives.Promise");
      case globalThis.Map: return this.FromName("Natives.Map");
      case globalThis.Set: return this.FromName("Natives.Set");
      case globalThis.Error: return this.FromName("Natives.Error");
      case globalThis.Date: return this.FromName("Natives.Date");
      case globalThis.URL: return this.FromName("Natives.URL");
      case globalThis.Int8Array: return this.FromName("Natives.Int8Array");
      case globalThis.Uint8Array: return this.FromName("Natives.Uint8Array");
      case globalThis.Uint8ClampedArray: return this.FromName("Natives.Uint8ClampedArray");
      case globalThis.Int16Array: return this.FromName("Natives.Int16Array");
      case globalThis.Uint16Array: return this.FromName("Natives.Uint16Array");
      case globalThis.Int32Array: return this.FromName("Natives.Int32Array");
      case globalThis.Uint32Array: return this.FromName("Natives.Uint32Array");
      case globalThis.Float32Array: return this.FromName("Natives.Float32Array");
      case globalThis.Float64Array: return this.FromName("Natives.Float64Array");
      case globalThis.BigInt64Array: return this.FromName("Natives.BigInt64Array");
      case globalThis.BigUint64Array: return this.FromName("Natives.BigUint64Array");
    }

    return this.GetTypeObject(current);
  }

  static Register(namespace, mod, type)
  {
    for (const name of Object.getOwnPropertyNames(mod))
    {
      const reference = this.Get(mod[name]);

      reference.Register(namespace, name, code++, type);

      fingerprint = Cyrb.Hash53(reference.GetName(), fingerprint);
    }
  }

  static Length(block)
  {
    const code = block.ReadU16();
    const ref = this.FromCode(code);

    return 2 + ref.Length(block);
  }

  static Encode(block, value, ...args)
  {
    const ref = this.GetTypeFrom(value);

    if (!ref)
    {
      throw new Error(`Failed to find a reference from value "${value}"`);
    }

    const code = ref.GetCode();
    block.WriteU16(code);
    return ref.Encode(block, value, ...args);
  }

  static Decode(block)
  {
    const code = block.ReadU16();
    const ref = this.FromCode(code);
    return ref.Decode(block);
  }

  // The constructor takes the actual value and assigns a unique Symbol
  constructor(value)
  {
    this[VALUE] = value;

    // return new Proxy(this, {
    //   get: (target, prop, receiver) => {
    //     // Custom logic for property access
    //     if (prop in target._internalState) {
    //       return target._internalState[prop];
    //     }

    //     // Default behavior
    //     return Reflect.get(...arguments);
    //   },
    //   set: (target, prop, value, receiver) => {
    //     // Custom logic for setting property
    //     // target._internalState[prop];
    //   },
    // });
  }

  Encode(block, value, ...args) { return this.GetType().Encode(block, value, ...args); }
  Decode(block) { return this.GetType().Decode(block); }
  Length(block) { return this.GetType().Length(block); }

  CreateName(mod_name, name) { return `${mod_name}.${name}`; }
  CreateCode(code) { return code; }
  CreateHash(name) { return Cyrb.Hash32(name); }
  CreateType(type) { return type; }

  Register(mod_name, name, code, type)
  {
    const n = this.CreateName(mod_name, name);
    const c = this.CreateCode(code);
    const h = this.CreateHash(n);
    const t = this.CreateType(type);

    // console.log("Registering", c, h, n);

    this.SetName(n);
    this.SetCode(c);
    this.SetHash(h);
    this.SetType(t);

    // // The reference is registered so now it shouldn't be changed again
    // Object.freeze(this);
  }

  SetType(type)
  {
    this[TYPE] = !!type;
  }

  SetName(name)
  {
    this[NAME] = name;

    if (NAMES.has(name)) throw new Error(`The name ${name} has already been registered, at "${this.GetLabel()}"`);
    NAMES.set(name, this);
  }

  SetCode(code)
  {
    this[CODE] = code;

    if (CODES.has(code)) throw new Error(`The code ${code} has already been registered, at "${this.GetLabel()}"`);
    CODES.set(code, this);
  }

  SetHash(hash)
  {
    this[HASH] = hash;

    if (HASHES.has(hash)) throw new Error(`The hash ${hash} has already been registered, at "${this.GetLabel()}"`);
    HASHES.set(hash, this);
  }

  GetValue() { return this[VALUE]; }
  GetSymbol() { return this[SYMBOL] ??= Symbol(this.GetName() ?? undefined); }
  GetName() { return this[NAME]; }
  GetType() { return this[TYPE] ?? this.GetValue(); }
  GetHash() { return this[HASH]; }

  GetLabel()
  {
    if (this.GetName()) return this.GetName();

    if (this.GetType() === true)
    {
      return this.GetValue().name;
    }
    else
    {
      return this.GetValue();
    }
  }

  [Symbol.toPrimitive](hint)
  {
    switch (hint)
    {
      case "string": return this.GetSymbol();
      default: return Object[Symbol.toPrimitive](hint);
    }
  }
}