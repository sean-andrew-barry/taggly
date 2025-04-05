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

// TypedArray isn't exposed as a global, so grab it here
const TypedArray = globalThis.Object.getPrototypeOf(globalThis.Uint8Array);

export class Block extends globalThis.DataView
{
  static GetStart(){ return 4; }
  static GetMetaDataBytes() { return 5; } // 4 bytes for the length, 1 byte for the type
  static GetMinBytes() { return this.GetMetaDataBytes() + 1; } // The smallest possible block has 1 byte for the value

  static GetFirst(buffer)
  {
    const start = this.GetStart();
    const length = new Int32Array(buffer, 4)[0];
    // const length = new DataView(buffer, 4).getInt32(0, true);
    // console.log("First length of", length);
    // return new this(buffer, start, length);
  }

  constructor(buffer, start = 0, length = 0)
  {
    super(buffer, start, length);
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

    // We have to make a new array, because this DataView doesn't extend that far, it would be out of bounds
    const length = new Int32Array(buffer, end, 1)[0];

    return new this.constructor(buffer, end, length);
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
  IsFree() { return this.GetType() === this.constructor.TYPE_FREE; }
  IsModule() { return this.GetType() === this.constructor.TYPE_MODULE; }
  IsImport() { return this.GetType() === this.constructor.TYPE_IMPORT; }

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

  async ExecuteWithLock(handler)
  {
    if (typeof handler !== "function") throw new TypeError(`Expected parameter handler to be a function, not "${typeof handler}"`);

    const buffer = this.GetBuffer();
    const array = new Int32Array(buffer, this.GetStart(), 1);
    const index = 0;

    // Read the length value non-atomically, if it's an old value, compareExchange will return the new version
    let current = array[0];
    while (true)
    {
      const positive = current & 0x7FFFFFFF; // Clear the sign, making it positive
      const negative = current | 0x80000000; // Set the sign, making it negative

      // If the atomic value is positive, it was unlocked, so we lock it
      current = Atomics.compareExchange(array, index, positive, negative);
      if (current === positive)
      {
        break;
      }
      else if ((current & 0x7FFFFFFF) !== this.byteLength)
      {
        // The magnitude change, meaning this Block is invalid
        const block = new this.constructor(buffer, this.byteOffset, current & 0x7FFFFFFF);
        return await block.ExecuteWithLock(handler);
      }
      else
      {
        const { async, value } = Atomics.waitAsync(array, index, current);
        if (async) await value;
      }
    }

    try
    {
      // We now own the lock; as long as it isn't bypassed, we can safely change state
      return await handler(this);
    }
    catch (error)
    {
      console.error(error);
    }
    finally
    {
      // Now, release the lock by writing the positive length again and notify any waiting threads
      Atomics.store(array, index, current & 0x7FFFFFFF);
      Atomics.notify(array, index);
    }
  }
}

Block.TYPE_FREE = 0;
Block.TYPE_MODULE = 1;
Block.TYPE_IMPORT = 2;