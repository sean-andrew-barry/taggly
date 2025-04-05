import Codes from "/js/Codes.js";

import {String} from "/js/String.js";
import {Symbol} from "/js/Symbol.js";
import {Boolean} from "/js/Boolean.js";
import {Number} from "/js/Number.js";
import {BigInt} from "/js/BigInt.js";
import {Undefined} from "/js/Undefined.js";
import {Function} from "/js/Function.js";
import {Object} from "/js/Object.js";

import {Null} from "/js/Null.js";
import {Array} from "/js/Array.js";
import {Map} from "/js/Map.js";
import {Set} from "/js/Set.js";
import {Promise} from "/js/Promise.js";
import {Error} from "/js/Error.js";
import {Date} from "/js/Date.js";
import {URL} from "/js/URL.js";

import {NaN} from "/js/Number/NaN.js";
import {Infinity} from "/js/Number/Infinity.js";

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

import {ArrayBufferNoType} from "/js/Error/ArrayBufferNoType.js";
import {ArrayBufferNoCode} from "/js/Error/ArrayBufferNoCode.js";

const PRIMARY_ARRAY_BUFFER = globalThis.Symbol("primary_array_buffer");

class DataView extends globalThis.DataView
{
  constructor(...args)
  {
    super(...args);
    this.index = this.byteOffset;
  }

  GetIndex(){ return this.index; }
  SetIndex(index){ return this.index = index; }

  Move(bytes)
  {
    // if (this.byteLength )
    this.index += bytes;
  }

  setInt8(i = this.index, v, o = 1){ this.index += o; return super.setInt8(i, v); }
  setUint8(i = this.index, v, o = 1){ this.index += o; return super.setUint8(i, v); }
  setInt16(i = this.index, v, o = 2){ this.index += o; return super.setInt16(i, v); }
  setUint16(i = this.index, v, o = 2){ this.index += o; return super.setUint16(i, v); }
  setInt32(i = this.index, v, o = 4){ this.index += o; return super.setInt32(i, v); }
  setUint32(i = this.index, v, o = 4){ this.index += o; return super.setUint32(i, v); }
  setFloat32(i = this.index, v, o = 4){ this.index += o; return super.setFloat32(i, v); }
  setBigInt64(i = this.index, v, o = 8){ this.index += o; return super.setBigInt64(i, v); }
  setBigUint64(i = this.index, v, o = 8){ this.index += o; return super.setBigUint64(i, v); }
  setFloat64(i = this.index, v, o = 8){ this.index += o; return super.setFloat64(i, v); }

  getInt8(i = this.index, o = 1){ this.index += o; return super.getInt8(i); }
  getUint8(i = this.index, o = 1){ this.index += o; return super.getUint8(i); }
  getInt16(i = this.index, o = 2){ this.index += o; return super.getInt16(i); }
  getUint16(i = this.index, o = 2){ this.index += o; return super.getUint16(i); }
  getInt32(i = this.index, o = 4){ this.index += o; return super.getInt32(i); }
  getUint32(i = this.index, o = 4){ this.index += o; return super.getUint32(i); }
  getFloat32(i = this.index, o = 4){ this.index += o; return super.getFloat32(i); }
  getBigInt64(i = this.index, o = 8){ this.index += o; return super.getBigInt64(i); }
  getBigUint64(i = this.index, o = 8){ this.index += o; return super.getBigUint64(i); }
  getFloat64(i = this.index, o = 8){ this.index += o; return super.getFloat64(i); }
}

export class ArrayBuffer extends globalThis.ArrayBuffer
{
  static GetPrimaryArrayBuffer()
  {
    return this[PRIMARY_ARRAY_BUFFER] ??= new ArrayBuffer(1024 * 1024);
  }

  static Encode(buffer = this.GetPrimaryArrayBuffer(), value)
  {
    const start = buffer.GetIndex();

    try
    {
      buffer.Write(value);
    }
    catch (error)
    {
      if (error instanceof globalThis.RangeError)
      {
        console.log("Resizing buffer");
        buffer = buffer.Resize();
      }
      else
      {
        throw error;
      }
    }

    const end = buffer.GetIndex();
    buffer.Reset();

    return buffer.slice(start, end);
  }

  static Decode(buffer)
  {
  }

  constructor(...args)
  {
    super(...args);
    // this.index = 0;
    this.view = new DataView(this);
  }

  Reset(){ this.view = new DataView(this); }

  Resize(size = Number.NextPowerOf2(this.byteLength) * 2)
  {
    const buffer = new ArrayBuffer(size);
    buffer.SetIndex(this.GetIndex());

    // Copy the values from the old buffer to the new
    new Uint8Array(buffer).set(new Uint8Array(this));

    return buffer;
  }

  Copy(typed_array, index = this.GetIndex(), offset = typed_array.byteLength)
  {
    // Copy the values into this array buffer at the index
    new typed_array.constructor(this).set(typed_array, index);

    // Move the index forward
    this.Advance(offset);
  }

  Advance(index)
  {
    this.view.index += index;
  }

  GetIndex(){ return this.view.GetIndex(); }
  GetOffset(){ return this.view.GetIndex(); }
  SetIndex(index){ return this.view.SetIndex(index); }
  SetOffset(offset){ return this.view.SetIndex(offset); }

  // set(array, offset)
  // {
  //   // this.view.index += array.byteLength ?? array.length;
  //   new Uint8Array(this).set(new Uint8Array(array), offset);
  // }

  WriteI8 (v, i, o){ this.view.setInt8(i, v, o); }
  WriteU8 (v, i, o){ this.view.setUint8(i, v, o); }
  WriteI16(v, i, o){ this.view.setInt16(i, v, o); }
  WriteU16(v, i, o){ this.view.setUint16(i, v, o); }
  WriteI32(v, i, o){ this.view.setInt32(i, v, o); }
  WriteU32(v, i, o){ this.view.setUint32(i, v, o); }
  WriteF32(v, i, o){ this.view.setFloat32(i, v, o); }
  WriteI64(v, i, o){ this.view.setBigInt64(i, v, o); }
  WriteU64(v, i, o){ this.view.setBigUint64(i, v, o); }
  WriteF64(v, i, o){ this.view.setFloat64(i, v, o); }

  ReadI8 (i, o){ return this.view.getInt8(i, o); }
  ReadU8 (i, o){ return this.view.getUint8(i, o); }
  ReadI16(i, o){ return this.view.getInt16(i, o); }
  ReadU16(i, o){ return this.view.getUint16(i, o); }
  ReadI32(i, o){ return this.view.getInt32(i, o); }
  ReadU32(i, o){ return this.view.getUint32(i, o); }
  ReadF32(i, o){ return this.view.getFloat32(i, o); }
  ReadI64(i, o){ return this.view.getBigInt64(i, o); }
  ReadU64(i, o){ return this.view.getBigUint64(i, o); }
  ReadF64(i, o){ return this.view.getFloat64(i, o); }

  GetTypeObject(value)
  {
    if (value === null) return Null;

    // For performance, check for each of the built-in constructors directly
    // Before we fall back to using instanceof
    const ctor = value.constructor;
    switch (ctor)
    {
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

    const codes = Codes();
    if (codes.has(value.constructor))
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
      default: throw new Error(`Unknown value type "${typeof(value)}"`);
    }
  }

  Write(value)
  {
    const codes = Codes();

    // Test if it is a static string (AKA if it has a code)
    if (typeof(value) === "string" && codes.has(value))
    {
      const code = codes.get(value);
      this.WriteU16(code);
    }
    else
    {
      const type = this.GetType(value);

      if (type === undefined)
      {
        throw new ArrayBufferNoType({
          type,
          value,
        });
      }

      const code = codes.get(type);

      if (code === undefined)
      {
        throw new ArrayBufferNoCode({
          type,
          code,
          value,
        });
      }

      this.WriteU16(code);
      return type.Encode(this, value);
    }
  }

  Read()
  {
    const code = this.ReadU16();

    const codes = Codes();
    if (!codes.has(code))
    {
      throw new globalThis.Error(`Buffer cannot read an unknown code "${code}" at index ${this.GetIndex()}`);
    }

    const type = codes.get(code);
    if (typeof(type) === "string")
    {
      return type;
    }
    else
    {
      return type.Decode(this);
    }
  }

  toString()
  {
    const index = this.GetIndex();

    let string = "";
    for (let i = 0; i < index; i += 2)
    {
      string += globalThis.String.fromCharCode(this.ReadU16(i, 0));
    }

    return string;
  }
}
