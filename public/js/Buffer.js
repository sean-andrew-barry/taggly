import {Codes} from "/js/Codes.js";

import {Environment} from "/js/Environment.js";

import {String} from "/js/String.js";
import {Symbol} from "/js/Symbol.js";
import {Boolean} from "/js/Boolean.js";
import {Number} from "/js/Number.js";
import {BigInt} from "/js/BigInt.js";
import {Undefined} from "/js/Undefined.js";
import {Function} from "/js/Function.js";
import {Object} from "/js/Object.js";
// export {ObjectID} from "/js/Utility/Database/ObjectID.js";

import {Null} from "/js/Null.js";
import {Array} from "/js/Array.js";
import {Map} from "/js/Map.js";
import {Set} from "/js/Set.js";
import {Promise} from "/js/Promise.js";
import {Error} from "/js/Error.js";
import {Date} from "/js/Date.js";
import {URL} from "/js/URL.js";

import {
  Int8Array,
  Uint8Array,
  Uint8ClampedArray,
  Int16Array,
  Uint16Array,
  Int32Array,
  Uint32Array,
  Float32Array,
  Float64Array,
  BigInt64Array,
  BigUint64Array,
} from "/js/TypedArray.js";

// Get access to the TypedArray object, which is not a global
const TYPED_ARRAY = globalThis.Object.getPrototypeOf(globalThis.Uint8Array);

export class Buffer
{
  static IsBitSet(v, i, mask = 1 << i){ return v & mask !== 0; }
  static GetBit(v, i, mask = 1 << i){ return v & mask === 0 ? 0 : 1; }
  static SetBit(v, i, mask = 1 << i){ return v | mask; }
  static ClearBit(v, i, mask = 1 << i){ return v & ~mask; }
  static ToggleBit(v, i, mask = 1 << i){ return v ^ mask; }

  constructor(value = 256)
  {
    if (typeof(value) === "number")
    {
      this.SetSize(value);
      this.SetBuffer(new ArrayBuffer(value));
    }
    else if (value instanceof globalThis.ArrayBuffer)
    {
      this.SetSize(value.byteLength ?? value.length);
      this.SetBuffer(value);
    }
    else if (value instanceof TYPED_ARRAY)
    {
      this.SetSize(value.byteLength ?? value.length);
      this.SetBuffer(value.buffer);
    }
    else if (Environment.IsServer() && value instanceof globalThis.Buffer)
    {
      this.SetSize(value.byteLength ?? value.length);
      this.SetBuffer(value.buffer);
    }

    this.SetOffset(0);
    this.SetView(new DataView(this.GetBuffer()));
  }

  #size = 0; // The size of the Buffer in bytes
  #offset = 0; // The current read/write offset
  #buffer; // The underlying ArrayBuffer
  #view; // A DataView object of the #buffer

  GetSize(){ return this.#size; }
  GetOffset(){ return this.#offset; }
  GetBuffer(){ return this.#buffer; }
  GetView(){ return this.#view; }

  SetSize(size){ this.#size = size; }
  SetOffset(offset){ this.#offset = offset; }
  SetBuffer(buffer){ this.#buffer = buffer; }
  SetView(view){ this.#view = view; }

  IsAtEnd(){ return this.GetOffset() >= this.GetSize(); }

  // QUESTION: What is the fastest way to copy an ArrayBuffer?
  Allocate(size = Number.NextPowerOf2(this.GetSize()) * 2)
  {
    // console.log("Allocating to", size, this.GetSize());

    const old = this.GetBuffer();

    // console.log("Allocating", size, "bytes", this.GetSize());
    const buffer = new ArrayBuffer(size);

    // Copy the values from the old buffer to the new
    new globalThis.Uint8Array(buffer).set(new globalThis.Uint8Array(old, 0, size));

    this.SetSize(size);
    this.SetBuffer(buffer);
    this.SetView(new DataView(buffer));
  }

  Copy(typed_array)
  {
    return this.Append(typed_array);
  }

  Append(typed_array)
  {
    const bytes = typed_array.byteLength;
    if (bytes > this.GetSize())
    {
      this.Allocate(Number.NextPowerOf2(bytes));
    }

    // Copy the values from the old buffer to the new
    new globalThis.Uint8Array(this.GetBuffer(), this.GetOffset()).set(typed_array);

    this.Advance(bytes);
  }

  Extract(bytes, offset = this.GetOffset())
  {
    this.Advance(bytes);
    return this.GetBuffer().slice(offset, offset + bytes);
  }

  Resize(offset)
  {
    if (offset >= this.GetSize())
    {
      // this.Allocate(Math.pow(this.size, 2));
      this.Allocate();
    }
  }

  Shrink()
  {
    const offset = this.GetOffset();
    if (this.GetSize() > offset)
    {
      this.Allocate(offset);
      this.Move(offset);
    }
  }

  Move(offset)
  {
    this.SetOffset(offset);
    return this;
  }

  Advance(offset)
  {
    this.SetOffset(this.GetOffset() + offset);
    return this;
  }

  Reset(){ return this.Move(0); }

  WriteHelper(name, value, offset = this.GetOffset(), move = true, bytes)
  {
    this.Resize(offset + bytes);

    // console.log("writing", name, value, "to", offset);
    this.GetView()[name](offset, value);

    if (move === true)
    {
      this.SetOffset(offset + bytes);
    }

    return offset;
  }

  ReadHelper(name, offset = this.GetOffset(), move = true, size = 1)
  {
    const value = this.GetView()[name](offset);

    // console.log("reading", name, value, "from", offset);

    if (move === true)
    {
      this.SetOffset(offset + size);
    }

    return value;
  }

  WriteU8 (value, offset, move){ return this.WriteHelper("setUint8", value, offset, move, 1); }
  WriteI8 (value, offset, move){ return this.WriteHelper("setInt8", value, offset, move, 1); }
  WriteU16(value, offset, move){ return this.WriteHelper("setUint16", value, offset, move, 2); }
  WriteI16(value, offset, move){ return this.WriteHelper("setInt16", value, offset, move, 2); }
  WriteU32(value, offset, move){ return this.WriteHelper("setUint32", value, offset, move, 4); }
  WriteI32(value, offset, move){ return this.WriteHelper("setInt32", value, offset, move, 4); }
  WriteF32(value, offset, move){ return this.WriteHelper("setFloat32", value, offset, move, 4); }
  WriteU64(value, offset, move){ return this.WriteHelper("setBigUint64", value, offset, move, 8); }
  WriteI64(value, offset, move){ return this.WriteHelper("setBigInt64", value, offset, move, 8); }
  WriteF64(value, offset, move){ return this.WriteHelper("setFloat64", value, offset, move, 8); }

  ReadU8 (offset, move){ return this.ReadHelper("getUint8", offset, move, 1); }
  ReadI8 (offset, move){ return this.ReadHelper("getInt8", offset, move, 1); }
  ReadU16(offset, move){ return this.ReadHelper("getUint16", offset, move, 2); }
  ReadI16(offset, move){ return this.ReadHelper("getInt16", offset, move, 2); }
  ReadU32(offset, move){ return this.ReadHelper("getUint32", offset, move, 4); }
  ReadI32(offset, move){ return this.ReadHelper("getInt32", offset, move, 4); }
  ReadF32(offset, move){ return this.ReadHelper("getFloat32", offset, move, 4); }
  ReadU64(offset, move){ return this.ReadHelper("getBigUint64", offset, move, 8); }
  ReadI64(offset, move){ return this.ReadHelper("getBigInt64", offset, move, 8); }
  ReadF64(offset, move){ return this.ReadHelper("getFloat64", offset, move, 8); }

  // Overrideable access to the Codes Map
  GetCodes(){ return Codes(); }

  GetTypeObject(value)
  {
    if (value === null) return Null;

    // For performance, check for each of the built-in constructors directly
    // Before we fall back to using instanceof
    const ctor = value.constructor;
    switch (ctor)
    {
      case globalThis.Object: return Object;
      case globalThis.Array: return Array;
      case globalThis.Promise: return Promise;
      case globalThis.Map: return Map;
      case globalThis.Set: return Set;
      case globalThis.Error: return Error;
      case globalThis.Date: return Date;
      case globalThis.URL: return URL;
      case globalThis.Int8Array: return Int8Array;
      case globalThis.Uint8Array: return Uint8Array;
      case globalThis.Uint8ClampedArray: return Uint8ClampedArray;
      case globalThis.Int16Array: return Int16Array;
      case globalThis.Uint16Array: return Uint16Array;
      case globalThis.Int32Array: return Int32Array;
      case globalThis.Uint32Array: return Uint32Array;
      case globalThis.Float32Array: return Float32Array;
      case globalThis.Float64Array: return Float64Array;
      case globalThis.BigInt64Array: return BigInt64Array;
      case globalThis.BigUint64Array: return BigUint64Array;
    }

    if (Codes.HasType(value.constructor))
    {
      // If a code is set for this constructor,
      // return the constructor as the type
      return value.constructor;
    }
    else if (value instanceof globalThis.Array) return Array;
    else if (value instanceof globalThis.Promise) return Promise;
    else if (value instanceof globalThis.Map) return Map;
    else if (value instanceof globalThis.Set) return Set;
    else if (value instanceof globalThis.Error) return Error;
    else if (value instanceof globalThis.Date) return Date;
    else if (value instanceof globalThis.URL) return URL;
    else if (value instanceof globalThis.Int8Array) return Int8Array;
    else if (value instanceof globalThis.Uint8Array) return Uint8Array;
    else if (value instanceof globalThis.Uint8ClampedArray) return Uint8ClampedArray;
    else if (value instanceof globalThis.Int16Array) return Int16Array;
    else if (value instanceof globalThis.Uint16Array) return Uint16Array;
    else if (value instanceof globalThis.Int32Array) return Int32Array;
    else if (value instanceof globalThis.Uint32Array) return Uint32Array;
    else if (value instanceof globalThis.Float32Array) return Float32Array;
    else if (value instanceof globalThis.Float64Array) return Float64Array;
    else if (value instanceof globalThis.BigInt64Array) return BigInt64Array;
    else if (value instanceof globalThis.BigUint64Array) return BigUint64Array;
    else return Object; // Fall back to the default Object type
  }

  GetTypeNumber(value)
  {
    if      (value === globalThis.NaN) return NaN;
    else if (value === globalThis.Infinity) return Infinity;
    else return Number;
  }

  GetType(value)
  {
    switch (typeof(value))
    {
      case "boolean": return Boolean;
      case "undefined": return Undefined;
      case "number": return this.GetTypeNumber(value);
      case "bigint": return BigInt;
      case "string": return String;
      case "symbol": return Symbol;
      case "function": return Function;
      case "object": return this.GetTypeObject(value);
      default: throw new globalThis.Error(`Unknown value type "${typeof(value)}"`);
    }
  }

  // GetCode(type)
  // {
  //   const codes = this.GetCodes();
  //   return codes.get(type);
  // }

  GetCodeFromType(type){ return Codes.GetType(type); }
  GetCodeFromInstance(instance){ return Codes.GetInstance(instance); }

  GetTypeFromCode(code){ return Codes.GetType(code); }
  GetInstanceFromCode(code){ return Codes.GetInstance(code); }

  // GetInstanceCodeFrom(value){ return Codes.GetInstance(value); }
  // GetTypeCodeFrom(value){ return Codes.GetType(value); }
  // GetInstanceCodeFrom(value){ return Codes.GetInstance(value); }
  // GetTypeFrom(code){ return Codes.GetType(code); }
  // GetInstanceFrom(code){ return Codes.GetInstance(code); }

  WriteCode(code){ return this.WriteU16(code); }
  ReadCode(move){ return this.ReadU16(undefined, move); }

  WriteMessageID(code){ return this.WriteU16(code); }
  ReadMessageID(){ return this.ReadU16(); }

  WriteLength(code){ return this.WriteU32(code); }
  ReadLength(){ return this.ReadU32(); }

  WriteString(value){ return String.Encode(this, value); }
  ReadString(){ return String.Decode(this); }

  WriteNumber(value){ return Number.Encode(this, value); }
  ReadNumber(){ return Number.Decode(this); }

  WriteBigInt(value){ return BigInt.Encode(this, value); }
  ReadBigInt(){ return BigInt.Decode(this); }

  WriteBoolean(value){ return Boolean.Encode(this, value); }
  ReadBoolean(){ return Boolean.Decode(this); }

  WriteSymbol(value){ return Symbol.Encode(this, value); }
  ReadSymbol(){ return Symbol.Decode(this); }

  WriteNull(value){ return Null.Encode(this, value); }
  ReadNull(){ return Null.Decode(this); }

  WriteUndefined(value){ return Undefined.Encode(this, value); }
  ReadUndefined(){ return Undefined.Decode(this); }

  WriteFunction(value, ...args){ return Function.Encode(this, value, ...args); }
  ReadFunction(self){ return Function.Decode(this, self); }

  WriteObject(value){ return Object.Encode(this, value); }
  ReadObject(){ return Object.Decode(this); }

  WriteArray(value){ return Array.Encode(this, value); }
  ReadArray(){ return Array.Decode(this); }

  Write(value)
  {
    const codes = this.GetCodes();

    // Test if it is a static string type
    if (typeof(value) === "string" && codes.has(value))
    {
      // console.log("Writing static string", value);
      const code = codes.get(value);
      this.WriteCode(code);
    }
    else
    {
      const type = this.GetType(value);
      const code = codes.get(type);

      if (code === undefined)
      {
        throw new globalThis.Error(`Buffer cannot write value "${value}", because it has no code`);
      }

      this.WriteCode(code);
      return type.Encode(this, value);
    }
  }

  Write(value, ...args)
  {
    const type = this.GetType(value);
    const code = this.GetCodeFromType(type);

    // console.log("~~~~writing", code, type?.name, value);

    if (code === undefined)
    {
      throw new globalThis.Error(`Buffer cannot write value "${value}", because it has no code`);
    }

    // const codes = this.GetCodes();

    // // Test if it is a registered value
    // if (!codes.has(value))
    // {
    //   this.WriteCode(code); // Write the constructor code
    // }

    this.WriteCode(code); // Write the type code
    return type.Encode(this, value, ...args);
  }

  Write(value, ...args)
  {
    if (Codes.HasInstance(value))
    {
      const type = Codes.GetTypeFromInstance(value);

      return type.Encode(this, value, ...args);
    }

    const type = this.GetType(value);

    if (Codes.HasType(type))
    {
      const code = Codes.GetType(type);
      this.WriteCode(code); // Write the type code

      return type.Encode(this, value, ...args);
    }
    
    throw new Error(`The value "${value}" at offset ${this.GetOffset()} is not registered as a type or instance`);
    // // const type = this.GetType(value);

    // if (!Codes.HasInstance(value))
    // {
    //   const code = Codes.GetType(type);
    //   this.WriteCode(code); // Write the type code
    // }

    // return type.Encode(this, value, ...args);
  }

  Read()
  {
    const code = this.ReadCode();
    // console.log("Reading", code);

    const codes = this.GetCodes();
    if (!codes.has(code))
    {
      throw new globalThis.Error(`Buffer cannot read an unknown code "${code}" at offset ${this.GetOffset()}`);
    }

    const type = codes.get(code);
    if (typeof(type) === "string")
    {
      // console.log("Reading static string", type);
      return type;
    }
    else
    {
      return type.Decode(this);
    }
  }

  Read()
  {
    const code = this.ReadCode(); // Read the type code

    const codes = this.GetCodes();
    if (!codes.has(code))
    {
      throw new globalThis.Error(`Buffer cannot read an unknown code "${code}" at offset ${this.GetOffset()}`);
    }

    const value = codes.get(code);
    return value.Decode(this);

    // if (typeof(value) === "function" && value !== globalThis.Object && value.prototype instanceof globalThis.Object)
    // {
    //   return value.Decode(this);
    // }
    // else
    // {
    //   this.Advance(-2);
    //   const type = this.GetType(value);

    //   return type.Decode(this);
    // }
  }

  Read()
  {
    const code = this.ReadCode(); // Read the type/instance code

    if (Codes.HasInstance(code))
    {
      // this.Advance(-2); // Backtrack so that the Decode function can read the instance code

      const value = Codes.GetInstance(code);
      const type = Codes.GetTypeFromInstance(value);

      return type.Decode(this, value);
    }
    else if (Codes.HasType(code))
    {
      const type = Codes.GetType(code);

      return type.Decode(this);
    }
    else
    {
      throw new Error(`The code "${code}" at offset ${this.GetOffset()} is not registered as a type or instance`);
    }
  }

  toString()
  {
    const offset = this.GetOffset();

    let string = "";
    for (let i = 0; i < offset; i += 2)
    {
      string += globalThis.String.fromCharCode(this.ReadU16(i, false));
    }

    return string;
  }
}
