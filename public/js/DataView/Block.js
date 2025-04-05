import { DataView } from "/js/DataView.js";
import { Reference } from "/js/Reference.js";

/**
 * Block - A Static View into a SharedArrayBuffer
 *
 * A Block is a fixed-length, fixed-offset DataView into an ArrayBuffer or SharedArrayBuffer,
 * designed for a specialized multi-threading pattern. Once created, a Block
 * will not reflect changes in the underlying buffer, requiring the creation 
 * of a new Block for updated views.
 *
 * Designed for a single-writer, no-reader followed by many-readers, no-writers scenario.
 */

const OFFSET = Symbol("offset");

// QUESTION: Technically this doesn't have to be a DataView, it could just use one. Should it?
export class Block extends DataView
{
  static GetStart() { return 4; }
  static GetMetaDataBytes() { return 5; } // 4 bytes for the length, 1 byte for the type
  static GetMinBytes() { return this.GetMetaDataBytes() + 1; } // The smallest possible block has 1 byte for the value
  static GetMetadataSize() { return 4; }
  static IsLengthDynamic(length = 0) { return length === 0; }

  static GetFirst(buffer)
  {
    const start = this.GetStart();
    const length = new Int32Array(buffer, 4)[0];
    // const length = new DataView(buffer, 4).getInt32(0, true);
    // console.log("First length of", length);
    // return new this(buffer, start, length);
  }

  constructor(buffer, start)
  {
    super(buffer, start);
    this.Reset();
  }

  Step(offset = 1) { this[OFFSET] += offset; }
  Skip(offset = 1) { this[OFFSET] += offset; return offset; }
  GetOffset() { return this[OFFSET]; }

  // Jump back to the beginning of the content
  Reset() { this[OFFSET] = this.constructor.GetMetadataSize(); }

  // These read/write functions are designed for automatically tracking the offset
  // To access an arbitrary offset, use the underlying functions like setInt8
  WriteI8(v) { this.SkipI8(); return this.setInt8(this.GetOffset(), v); }
  WriteU8(v) { this.SkipU8(); return this.setUint8(this.GetOffset(), v); }
  WriteI16(v) { this.SkipI16(); return this.setInt16(this.GetOffset(), v); }
  WriteU16(v) { this.SkipU16(); return this.setUint16(this.GetOffset(), v); }
  WriteI32(v) { this.SkipI32(); return this.setInt32(this.GetOffset(), v); }
  WriteU32(v) { this.SkipU32(); return this.setUint32(this.GetOffset(), v); }
  WriteF32(v) { this.SkipF32(); return this.setFloat32(this.GetOffset(), v); }
  WriteI64(v) { this.SkipI64(); return this.setBigInt64(this.GetOffset(), v); }
  WriteU64(v) { this.SkipU64(); return this.setBigUint64(this.GetOffset(), v); }
  WriteF64(v) { this.SkipF64(); return this.setFloat64(this.GetOffset(), v); }

  ReadI8() { this.SkipI8(); return this.getInt8(this.GetOffset()); }
  ReadU8() { this.SkipU8(); return this.getUint8(this.GetOffset()); }
  ReadI16() { this.SkipI16(); return this.getInt16(this.GetOffset()); }
  ReadU16() { this.SkipU16(); return this.getUint16(this.GetOffset()); }
  ReadI32() { this.SkipI32(); return this.getInt32(this.GetOffset()); }
  ReadU32() { this.SkipU32(); return this.getUint32(this.GetOffset()); }
  ReadF32() { this.SkipF32(); return this.getFloat32(this.GetOffset()); }
  ReadI64() { this.SkipI64(); return this.getBigInt64(this.GetOffset()); }
  ReadU64() { this.SkipU64(); return this.getBigUint64(this.GetOffset()); }
  ReadF64() { this.SkipF64(); return this.getFloat64(this.GetOffset()); }

  SkipI8() { return this.Skip(1); }
  SkipU8() { return this.Skip(1); }
  SkipI16() { return this.Skip(2); }
  SkipU16() { return this.Skip(2); }
  SkipI32() { return this.Skip(4); }
  SkipU32() { return this.Skip(4); }
  SkipF32() { return this.Skip(4); }
  SkipI64() { return this.Skip(8); }
  SkipU64() { return this.Skip(8); }
  SkipF64() { return this.Skip(8); }

  Append(data, is_little_endian)
  {
    const start = this.GetOffset();
    const bytes = super.Copy(start, data, is_little_endian);
    return this.Skip(bytes);
  }

  Extract(type, length, is_little_endian)
  {
    const data = super.Extract(type, this.GetOffset(), length, is_little_endian);
    this.Skip(data.byteLength);

    return data;
  }

  /**
   * Returns the absolute length of the Block.
   *
   * The length can be negative due to locking, but what matters is the magnitude.
   * @return {number} The absolute length of the Block.
   */
  GetLength()
  {
    // Always get the length as a positive number
    const length = this.getInt32(0) & 0x7FFFFFFF;

    if (length !== this.byteLength) throw new Error(`Cannot read the length of an invalid Block. Blocks become invalid if the buffer they point to changes. Create a new Block to interact with the updated buffer.`);

    return length;
  }

  GetType()
  {
    if (this.IsInvalid()) throw new Error(`Cannot read the type of an invalid Block. Blocks become invalid if the buffer they point to changes. Create a new Block to interact with the updated buffer.`);

    return this.getUint8(4);
  }

  SetType(type)
  {
    this.setUint8(4, type);
  }

  GetBuffer() { return this.buffer; }
  GetStart() { return this.byteOffset; }
  GetEnd() { return this.GetStart() + this.GetLength(); }
  GetByteLength() { return this.byteLength; }

  GetNext()
  {
    if (this.IsInvalid()) throw new Error(`Cannot get the next Block from an invalid Block`);
    if (this.IsLast()) return undefined;

    const buffer = this.GetBuffer();
    const end = this.GetEnd();

    return new this.constructor(buffer, end);
  }

  // A Block becomes invalid when its absolute length changes.
  // However, its sign can flip due to locking without invalidating the block.
  IsInvalid() { return (this.getInt32(0) & 0x7FFFFFFF) !== this.byteLength; }
  IsFirst() { return this.GetStart() === 0; }
  IsLast() { return this.GetEnd() >= this.GetBuffer().byteLength; }
  IsSame(block) { return this.GetStart() === block.GetStart(); }
  IsAfter(block) { return this.GetStart() > block.GetStart(); }
  IsBefore(block) { return this.GetStart() < block.GetStart(); }
  IsNext(block) { return this.GetEnd() !== block.GetStart(); }

  // Extend this block to include the target block
  Combine(block)
  {
    if (!(block instanceof Block)) throw new TypeError(`Expected parameter block to be a Block, not "${block?.constructor.name}"`);
    if (this.IsInvalid()) throw new Error(`Cannot combine because this Block is invalid`);
    if (block.IsInvalid()) throw new Error(`Cannot combine because the target Block is invalid`);
    if (!this.IsNext(block)) throw new Error(`Cannot combine because the target Block is not the next Block`);

    const buffer = this.GetBuffer();
    const start = this.GetStart();

    // Change the length of this Block, which invalidates it
    const length = this.GetLength() + block.GetLength();
    this.setInt32(0, length);
    block.setInt32(0, 0); // Now has a length of zero, invalidating it

    // Return a block that spans both
    return new this.constructor(buffer, start, length);
  }

  /**
   * Splits the current Block at the given length.
   * Note: This action invalidates the current Block.
   * @param {number} length - The length at which to split the Block.
   * @return {Block} - A new Block representing the updated state.
   */
  Split(length)
  {
    if (typeof length !== "number") throw new TypeError(`Expected parameter length to be a number, not "${typeof length}"`);
    if (this.IsInvalid()) throw new Error(`Cannot split because this Block is invalid`);

    const remaining = this.byteLength - length;

    if (this.constructor.GetMinBytes() > remaining) throw new Error(`Cannot split Block at length ${length}, because the new block must be more than ${this.constructor.GetMinBytes()} bytes long`);

    // Setup the new block at the offset, with the remaining space as its length
    this.setInt32(length, remaining);
    this.setUint8(length + 4, this.constructor.TYPE_FREE);

    const buffer = this.GetBuffer();
    const start = this.GetStart();

    // Change the length of this Block, which invalidates it
    this.setInt32(0, length);

    // So return a new version of this Block
    return new this.constructor(buffer, start, length);
  }

  WriteModule(offset = 0, flags, url, data)
  {
    if (typeof flags !== "number") throw new TypeError(`Expected parameter flags to be a number, not "${typeof flags}"`);
    if (typeof url !== "string") throw new TypeError(`Expected parameter url to be a string, not "${typeof url}"`);
    if (data instanceof TypedArray) throw new TypeError(`Expected parameter data to be a Block, not "${data?.constructor.name}"`);

    // Write the type metadata
    this.SetType(this.constructor.TYPE_MODULE);

    offset += this.WriteFlags(offset, flags);
    offset += this.WriteString(offset, url);
    offset += this.WriteBuffer(offset, data);

    return offset;
  }

  WriteImport(offset = 0, block, parent, specifier)
  {
    if (!(block instanceof Block)) throw new TypeError(`Expected parameter block to be a Block, not "${block?.constructor.name}"`);
    if (!(parent instanceof Block)) throw new TypeError(`Expected parameter parent to be a Block, not "${parent?.constructor.name}"`);
    if (typeof specifier !== "string") throw new TypeError(`Expected parameter specifier to be a string, not "${typeof specifier}"`);

    // Write the type metadata
    this.SetType(this.constructor.TYPE_IMPORT);

    // Write the references first, since they are fixed length
    offset += this.WriteReference(offset, block);
    offset += this.WriteReference(offset, parent);
    offset += this.WriteString(offset, specifier);

    return offset;
  }

  WriteReference(offset = 0, block)
  {
    if (!(parent instanceof Block)) throw new TypeError(`Expected parameter block to be a Block, not "${block?.constructor.name}"`);

    const MD = this.constructor.GetMetaDataBytes();

    // Record where the block is located in the buffer
    this.setUint32(MD + offset, block.GetStart());

    // Return the number of bytes written
    return 4;
  }

  WriteBuffer(offset = 0, buffer)
  {
    const MD = this.constructor.GetMetaDataBytes();

    // Write the buffer's length at the requested offset
    this.setUint32(MD + offset, buffer.byteLength);

    // Copy the buffer into this view's buffer, accounting for the metadata, offset, and the uint32
    new Uint8Array(this.GetBuffer(), this.GetStart() + MD + offset + 4).set(buffer);

    // Return the number of bytes written
    return buffer.byteLength + 4;
  }

  WriteFlags(offset = 0, flags)
  {
    const MD = this.constructor.GetMetaDataBytes();

    // Write the flags
    this.setUint32(MD + offset, flags);

    // Return the number of bytes written
    return 4;
  }

  WriteString(offset = 0, string)
  {
    if (typeof string !== "string") throw new TypeError(`Expected parameter string to be a string, not "${typeof string}"`);

    const buffer = new TextEncoder().encode(string);
    return this.WriteBuffer(offset, buffer);
  }

  ReadModule(offset = 0)
  {
    if (!this.IsModule()) throw new TypeError(`Cannot read as a module because the Block's type is not a module`);

    const { bytes: b1, value: flags } = this.ReadFlags(offset);
    offset += b1;

    const { bytes: b2, value: url } = this.ReadString(offset);
    offset += b2;

    const { bytes: b3, value: data } = this.ReadBuffer(offset);
    offset += b3;

    return {
      bytes: b1 + b2 + b3,
      flags,
      url,
      data,
    };
  }

  ReadImport(offset = 0)
  {
    if (!this.IsImport()) throw new TypeError(`Cannot read as an import because the Block's type is not an import`);

    const { bytes: b1, value: block } = this.ReadReference(offset);
    offset += b1;

    const { bytes: b2, value: parent } = this.ReadReference(offset);
    offset += b2;

    const { bytes: b3, value: specifier } = this.ReadString(offset);
    offset += b3;

    return {
      bytes: b1 + b2 + b3,
      block,
      parent,
      specifier,
    };
  }

  ReadString(offset = 0)
  {
    const MD = this.constructor.GetMetaDataBytes();

    const length = this.getUint32(MD + offset);
    const data = new Uint8Array(this.GetBuffer(), MD + offset + 4, length);

    return {
      bytes: 4 + data.byteLength,
      value: new TextDecoder().decode(data),
    };
  }

  ReadFlags(offset = 0)
  {
    const MD = this.constructor.GetMetaDataBytes();

    const flags = this.getUint32(MD + offset);

    return {
      bytes: 4,
      value: flags,
    };
  }

  ReadReference(offset = 0)
  {
    const MD = this.constructor.GetMetaDataBytes();

    // The value encoded in this block tells where the start of the referenced block is
    const start = this.getUint32(MD + offset);

    // Go to the start and extract the length of the referenced block
    const length = this.getInt32(start);

    const block = new this.constructor(this.GetBuffer(), start, length);

    return {
      bytes: 4,
      value: block,
    };
  }

  IsShared() { return this.buffer instanceof SharedArrayBuffer; }

  static GetValue(buffer, index = 0) {
    const array = new Int32Array(buffer, index, 1);

    let value;
    if (buffer instanceof SharedArrayBuffer)
    {
      value = Atomics.load(array, index);
    }
    else
    {
      value = array[0];
    }
  }

  static GetLocked(v) { return (v >> 31) & 1; } // Extracts the locked bit (1 bit)
  static GetCode(v) { return (v >> 16) & 32767; } // Extracts the 15 bits for type code (32767 = 2^15 - 1)
  static GetLength(v) { return v & 65535; } // Extracts the 16 bits for block length (65535 = 2^16 - 1)

  static GetBlock_Ignore(buffer, index = 0) {
    const value = this.GetValue(buffer, index);

    // Extract the length portion from the value
    let length = this.GetLength(value);
    if (length === 0)
    {
      const temp = new this(buffer, index);
      // const code = this.GetCode(value);
      // const reference = Reference.FromCode(code);
      const reference = temp.GetReference();
      length = reference.Length(temp);
    }
    
    return new this.constructor(buffer, index, length);
  }

  GetBlockAt(index) {
    const buffer = this.GetBuffer();
    return new this.constructor(buffer, index);
  }

  GetMetadata()
  {
    if (this.IsShared())
    {
      const array = new Int32Array(this.GetBuffer(), this.GetStart(), 1);
      return Atomics.load(array, 0);
    }
    else
    {
      return this.getInt32(0);
    }
  }

  GetLocked(m = this.GetMetadata()) { return (m >> 31) & 1; } // Extracts the locked bit (1 bit)
  GetCode(m = this.GetMetadata()) { return (m >> 16) & 32767; } // Extracts the 15 bits for type code (32767 = 2^15 - 1)
  // GetLength(m = this.GetMetadata()) { return m & 65535; } // Extracts the 16 bits for block length (65535 = 2^16 - 1)

  GetLength(m = this.GetMetadata()) {
    let length = m & 65535; // Extracts the 16 bits for block length (65535 = 2^16 - 1)

    // A dynamic length means the block doesn't know its length
    if (this.constructor.IsLengthDynamic(length))
    {
      // So it tries to ask its reference
      const ref = this.GetReference();
      if (ref)
      {
        length = ref.Length(this);
        this.Reset();
  
        if (65535 >= length)
        {
          throw new RangeError(`Block at offset ${this.byteOffset} is using a dynamic length, but its reference is claiming a length of ${length}, which should have fit`);
        }
      }
      else
      {
        // The block falls back to its byteLength, which is usually to the end of the buffer
        return this.byteLength;
      }
    }

    return length + this.constructor.GetMetadataSize();
  }

  SetMetadata(value)
  {
    if (this.IsShared())
    {
      const array = new Int32Array(this.GetBuffer(), this.GetStart(), 1);
      Atomics.store(array, 0, value);
    }
    else
    {
      this.setInt32(0, value);
    }
  }

  SetLocked(locked)
  {
    let value = this.GetValue();
    value = locked ? (value | (1 << 31)) : (value & ~(1 << 31));
    this.SetMetadata(value);
  }

  SetCode(code)
  {
    if (code < 0 || code > 32767)
    {
      throw new RangeError("Code must be between 0 and 32767");
    }

    let value = this.GetValue();
    value = (value & ~(32767 << 16)) | ((code & 32767) << 16);
    this.SetMetadata(value);
  }

  SetLength(length)
  {
    if (length < 0 || length > 65535)
    {
      throw new RangeError("Length must be between 0 and 65535");
    }

    let value = this.GetValue();
    value = (value & ~65535) | (length & 65535);
    this.SetMetadata(value);
  }

  GetFullMetadata()
  {
    const value = this.GetMetadata();

    return {
      locked: this.GetLocked(value),
      code: this.GetCode(value),
      length: this.GetLength(value),
    };
  }

  GetReference()
  {
    const code = this.GetCode();
    if (code === 0) return undefined;

    if (!Reference.HasCode(code))
    {
      throw new Error(`No reference has been registered for type code "${code}"`);
    }

    return Reference.FromCode(code);
  }

  // @Summary("Writes the given `value` to the buffer and updates the block's length")
  // @Parameter("value", undefined, "")
  // @Parameter("...args", Array)
  Write(value, ...args)
  {
    const reference = Reference.GetTypeFrom(value);

    if (!reference)
    {
      throw new Error(`No reference has been registered for value "${value}"`);
    }

    this.Reset();
    const start = this.GetOffset();
    reference.Encode(this, value, ...args);
    const end = this.GetOffset();

    // Update the length
    this.SetLength(end - start);
  }

  Read()
  {
    const reference = this.GetReference();

    this.Reset();
    const start = this.GetOffset();
    const value = reference.Decode(this);
    const end = this.GetOffset();

    this.SetLength(end - start);

    return value;
  }

  ExecuteWithLockSync(handler)
  {
    if (!this.IsShared()) throw new Error(`ExecuteWithLock is only valid if the Block is using a SharedArrayBuffer`);
    if (typeof handler !== "function") throw new TypeError(`Expected parameter handler to be a function, not "${typeof handler}"`);

    const array = new Int32Array(this.GetBuffer(), this.GetStart(), 1);
    const index = 0;

    // Read the length value non-atomically since if it's old, compareExchange will return the new version
    let value = array[0];
    while (true)
    {
      const unlocked = value & 0x7FFFFFFF; // Clear the sign
      const locked = value | 0x80000000; // Set the sign

      value = Atomics.compareExchange(array, index, unlocked, locked);
      if (this.GetLocked(value) === 1)
      {
        break;
      }
    }

    try
    {
      // We now own the lock; as long as it isn't bypassed, we can safely change state
      return handler(this);
    }
    catch (error)
    {
      throw error;
    }
    finally
    {
      // Now, release the lock and notify any waiting threads
      this.SetLocked(0);
      Atomics.notify(array, index);
    }
  }

  async ExecuteWithLock(handler)
  {
    if (!this.IsShared()) throw new Error(`ExecuteWithLock is only valid if the Block is using a SharedArrayBuffer`);
    if (typeof handler !== "function") throw new TypeError(`Expected parameter handler to be a function, not "${typeof handler}"`);

    const buffer = this.GetBuffer();
    const array = new Int32Array(buffer, this.GetStart(), 1);
    const index = 0;

    // Read the length value non-atomically since if it's old, compareExchange will return the new version
    let value = array[0];
    while (true)
    {
      const unlocked = value & 0x7FFFFFFF; // Clear the sign
      const locked = value | 0x80000000; // Set the sign

      value = Atomics.compareExchange(array, index, unlocked, locked);
      if (this.GetLocked(value) === 1)
      {
        break;
      }
      else
      {
        const length = this.GetLength(value);
        if (length !== this.byteLength)
        {
          // If the length changed then this Block is invalid, so try again
          const block = new this.constructor(buffer, this.byteOffset, length);
          return await block.ExecuteWithLock(handler);
        }
        else
        {
          const { async, value } = Atomics.waitAsync(array, index, value);
          if (async) await value;
        }
      }
    }

    try
    {
      // We now own the lock; as long as it isn't bypassed, we can safely change state
      return await handler(this);
    }
    catch (error)
    {
      throw error;
    }
    finally
    {
      // Now, release the lock and notify any waiting threads
      this.SetLocked(0);
      Atomics.notify(array, index);
    }
  }
}