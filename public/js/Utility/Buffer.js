import {Number} from "/js/Number.js";

// Get access to the TypedArray object, which is not a global
const TYPED_ARRAY = globalThis.Object.getPrototypeOf(globalThis.Uint8Array);

const SIZE = globalThis.Symbol("size");
const OFFSET = globalThis.Symbol("offset");
const BUFFER = globalThis.Symbol("buffer");
const VIEW = globalThis.Symbol("view");

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
      this.SetBuffer(new globalThis.ArrayBuffer(value));
    }
    else if (value instanceof globalThis.ArrayBuffer)
    {
      this.SetSize(value.byteLength ?? value.length);
      this.SetBuffer(value);
    }
    else if (globalThis.Buffer && value instanceof globalThis.Buffer) // Handle Node.js buffers
    {
      this.SetSize(value.byteLength ?? value.length);
      this.SetBuffer(new Uint8Array(value).buffer);
    }
    else if (value instanceof TYPED_ARRAY)
    {
      this.SetSize(value.byteLength ?? value.length);
      this.SetBuffer(value.buffer);
    }
    else
    {
      throw new Error(`Unknown value passed to Buffer constructor "${value}"`);
    }

    this.SetOffset(0);
    this.SetView(new DataView(this.GetBuffer()));
    // console.log("Constructed buffer", value, this.GetBuffer());
  }

  GetSize(){ return this[SIZE]; }
  GetOffset(){ return this[OFFSET]; }
  GetBuffer(){ return this[BUFFER]; }
  GetView(){ return this[VIEW]; }

  SetSize(size){ this[SIZE] = size; }
  SetOffset(offset){ this[OFFSET] = offset; }
  SetBuffer(buffer){ this[BUFFER] = buffer; }
  SetView(view){ this[VIEW] = view; }

  IsAtEnd(){ return this.GetOffset() >= this.GetSize(); }

  Allocate(size = Number.NextPowerOf2(this.GetSize()) * 2)
  {
    const old = this.GetBuffer();

    // console.log("Allocating", size, "bytes", this.GetSize());

    let buffer = old;

    if (size > this.GetSize()) // Enlarge the buffer
    {
      buffer = new globalThis.ArrayBuffer(size);

      // Copy the values from the old buffer to the new
      new globalThis.Uint8Array(buffer).set(new globalThis.Uint8Array(old));
    }
    else if (size < this.GetSize()) // Shrink the buffer
    {
      buffer = this.GetBuffer().slice(0, size);
    }

    this.SetSize(size);
    this.SetBuffer(buffer);
    this.SetView(new globalThis.DataView(buffer));
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
    this.Allocate(this.GetOffset());
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

  WriteFrom(typed_array)
  {
    const offset = this.GetOffset();
    this.Advance(typed_array.byteLength);

    new globalThis.Uint8Array(this.GetBuffer()).set(typed_array, offset);

    return offset;
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
