const UNDEFINED_CODE = 0;
const NULL_CODE = 1;
const BOOLEAN_CODE = 2;
const NUMBER_CODE = 3;
const STRING_CODE = 4;
const OBJECT_CODE = 5;
const ARRAY_CODE = 6;

const INDEX_OFFSET = 8; // 64 bits for indices

export class CircularSharedArrayBuffer
{
  constructor(buffer)
  {
    if (typeof buffer === "number")
    {
      buffer = new globalThis.SharedArrayBuffer(buffer);
    }
    
    this.buffer = buffer;
    this.index = 0; // The local position, gets synchronized after completing each send/receive
    this.size = this.buffer.byteLength - INDEX_OFFSET; // Actual buffer size minus index space
    this.view = new DataView(this.buffer);
  }

  Advance(offset = 0)
  {
    this.index += offset;

    const remaining = this.size - this.index;

    if (0 >= remaining)
    {
      throw new Error(`CircularSharedArrayBuffer reached the end, which shouldn't happen`);
    }
    else if (8 >= remaining)
    {
      // If we're within 8 bytes of the end, wrap around
      // This way we won't hit the end mid write, since each write is a maximum of 8 bytes
      this.index = 0;
    }
  }

  // Atomically read and update indices
  get read_index() { return Atomics.load(this.view, this.size); }
  set read_index(value) { Atomics.store(this.view, this.size, value % this.size); }

  get write_index() { return Atomics.load(this.view, this.size + 4); }
  set write_index(value) { Atomics.store(this.view, this.size + 4, value % this.size); }

  PushU8 (v){ this.view.setUint8 (this.index, v); this.Advance(1); return this; }
  PushU16(v){ this.view.setUint16(this.index, v); this.Advance(2); return this; }
  PushU32(v){ this.view.setUint32(this.index, v); this.Advance(4); return this; }
  PushU64(v){ this.view.setUint64(this.index, v); this.Advance(8); return this; }
  PopU8 (){ const v = this.view.getUint8 (this.index); this.Advance(1); return v; }
  PopU16(){ const v = this.view.getUint16(this.index); this.Advance(2); return v; }
  PopU32(){ const v = this.view.getUint32(this.index); this.Advance(4); return v; }
  PopU64(){ const v = this.view.getUint64(this.index); this.Advance(8); return v; }
  
  PushF64(v){ this.view.setFloat64(this.index, v); this.Advance(8); return this; }
  PopF64(){ const v = this.view.getFloat64(this.index); this.Advance(8); return v; }

  PushCode(code){ return this.PushU8(code); }
  PopCode(){ return this.PopU8(); }

  WriteUndefined(){ this.PushCode(UNDEFINED_CODE); }
  WriteNull(){ this.PushCode(NULL_CODE); }

  WriteString(value)
  {
    this.PushCode(STRING_CODE); // Write the type code

    const encoded = new TextEncoder().encode(value);
    
    this.PushU32(encoded.byteLength); // Write the length

    for (let i = 0; i < encoded.length; i++)
    {
      this.PushU8(encoded[i]); // Write each byte
    }
  }

  WriteNumber(value)
  {
    this.PushCode(NUMBER_CODE); // Write the type code
    this.PushF64(value); // Write the value
  }

  WriteBoolean(value)
  {
    this.PushCode(BOOLEAN_CODE); // Write the type code
    this.PushU8(value ? 1 : 0); // Write the value
  }

  WriteArray(array)
  {
    this.PushCode(ARRAY_CODE);

    this.PushU32(array.length);
    for (let i = 0; i < array.length; i++)
    {
      this.Write(array[i]);
    }
  }

  WriteObject(object)
  {
    this.PushCode(OBJECT_CODE);

    const keys = Object.keys(object);
    this.PushU32(keys.length);

    for (let i = 0; i < keys.length; i++)
    {
      const key = keys[i];
      const val = object[key];

      this.Write(key);
      this.Write(val);
    }
  }

  // Undefined and null are constants, so we don't actually read anything
  ReadUndefined(value) { return undefined; }
  ReadNull(value) { return null; }
  ReadBoolean() { return this.PopU8() === 1 ? true : false; }
  ReadNumber() { return this.PopF64(); }

  ReadString()
  {
    const length = this.PopU32();
    let remaining = length;
  
    let parts = [];
  
    while (remaining > 0)
    {
      // Calculate how much we can read before reaching the end of the circular buffer
      const readable = Math.min(remaining, this.size - this.index);
  
      // Read up to the end of the buffer or the end of the string, whichever comes first
      const buffer = new Uint8Array(this.buffer, this.index, readable);
      parts.push(buffer);
  
      // Advance the read index and decrease the remaining length
      this.Advance(readable);
      remaining -= readable;
    }
  
    // Combine all parts and decode
    const combined = new Uint8Array(length);
    let offset = 0;
    for (const part of parts)
    {
      combined.set(part, offset);
      offset += part.length;
    }
  
    return new TextDecoder().decode(combined);
  }

  ReadArray()
  {
    const array = [];
    
    const length = this.PopU32();
    for (let i = 0; i < length; i++)
    {
      array.push(this.Read());
    }
    
    return array;
  }

  ReadObject()
  {
    const object = {};

    const length = this.PopU32();

    for (let i = 0; i < length; i++)
    {
      const key = this.Read();
      const val = this.Read();

      object[key] = val;
    }

    return object;
  }

  Write(value)
  {
    switch (typeof(value))
    {
      case "undefined": return this.WriteUndefined(value);
      case "boolean": return this.WriteBoolean(value);
      case "number": return this.WriteNumber(value);
      case "string": return this.WriteString(value);
      case "object":
      {
        if (value === null) return this.WriteNull(value);
        else if (value instanceof Array) return this.WriteArray(value);
        else return this.WriteObject(value);
      }
      default: throw new Error(`Unknown data type of "${typeof(value)}"`);
    }
  }

  Read()
  {
    const code = this.PopCode();

    switch (code)
    {
      case UNDEFINED_CODE: return this.ReadUndefined();
      case NULL_CODE: return this.ReadNull();
      case BOOLEAN_CODE: return this.ReadBoolean();
      case NUMBER_CODE: return this.ReadNumber();
      case STRING_CODE: return this.ReadString();
      case OBJECT_CODE: return this.ReadObject();
      case ARRAY_CODE: return this.ReadArray();
      default: throw new Error(`Unknown data type of "${typeof(value)}"`);
    }
  }

  Send(...args)
  {
    for (const value of args)
    {
      this.Write(value);
    }

    // Perform the atomic update, indicating the write is complete
    this.write_index = this.index;
  }

  Receive()
  {
    const args = [];

    const end = this.write_index;
    while (this.index !== end)
    {
      args.push(this.Read());
    }

    return args;
  }
}

  // WriteArray(array)
  // {
  //   this.PushCode(ARRAY_CODE);

  //   // We don't yet know the size of the array, so save the index and write a 0 for now
  //   const position = this.index;
  //   this.PushU32(0);

  //   for (const value of array)
  //   {
  //     this.Write(value);
  //   }

  //   // Now go back to where the size is and update it based on how far we advanced when writing
  //   this.view.setUint32(position, this.index - position - 4);
  // }