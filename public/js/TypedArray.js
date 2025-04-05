const g = globalThis;

export class Int8Array extends g.Int8Array
{
  static Encode(buffer, value)
  {
    buffer.WriteU32(value.byteLength);
    buffer.Append(value);
  }

  static Decode(buffer)
  {
    const bytes = buffer.ReadU32();
    return new g.Int8Array(buffer.Extract(bytes));
  }
}

export class Uint8Array extends g.Uint8Array
{
  static Encode(buffer, value)
  {
    buffer.WriteU32(value.byteLength);
    buffer.Append(value);
  }

  static Decode(buffer)
  {
    const bytes = buffer.ReadU32();
    return new g.Uint8Array(buffer.Extract(bytes));
  }
}

export class Uint8ClampedArray extends g.Uint8ClampedArray
{
  static Encode(buffer, value)
  {
    buffer.WriteU32(value.byteLength);
    buffer.Append(value);
  }

  static Decode(buffer)
  {
    const bytes = buffer.ReadU32();
    return new g.Uint8ClampedArray(buffer.Extract(bytes));
  }
}

export class Int16Array extends g.Int16Array
{
  static Encode(buffer, value)
  {
    buffer.WriteU32(value.byteLength);
    buffer.Append(value);
  }

  static Decode(buffer)
  {
    const bytes = buffer.ReadU32();
    return new g.Int16Array(buffer.Extract(bytes));
  }
}

export class Uint16Array extends g.Uint16Array
{
  static Encode(buffer, value)
  {
    buffer.WriteU32(value.byteLength);
    buffer.Append(value);
  }

  static Decode(buffer)
  {
    const bytes = buffer.ReadU32();
    return new g.Uint16Array(buffer.Extract(bytes));
  }
}

export class Int32Array extends g.Int32Array
{
  static Encode(buffer, value)
  {
    buffer.WriteU32(value.byteLength);
    buffer.Append(value);
  }

  static Decode(buffer)
  {
    const bytes = buffer.ReadU32();
    return new g.Int32Array(buffer.Extract(bytes));
  }
}

export class Uint32Array extends g.Uint32Array
{
  static Encode(buffer, value)
  {
    buffer.WriteU32(value.byteLength);
    buffer.Append(value);
  }

  static Decode(buffer)
  {
    const bytes = buffer.ReadU32();
    return new g.Uint32Array(buffer.Extract(bytes));
  }
}

export class Float32Array extends g.Float32Array
{
  static Encode(buffer, value)
  {
    buffer.WriteU32(value.byteLength);
    buffer.Append(value);
  }

  static Decode(buffer)
  {
    const bytes = buffer.ReadU32();
    return new g.Float32Array(buffer.Extract(bytes));
  }
}

export class Float64Array extends g.Float64Array
{
  static Encode(buffer, value)
  {
    buffer.WriteU32(value.byteLength);
    buffer.Append(value);
  }

  static Decode(buffer)
  {
    const bytes = buffer.ReadU32();
    return new g.Float64Array(buffer.Extract(bytes));
  }
}

export class BigInt64Array extends g.BigInt64Array
{
  static Encode(buffer, value)
  {
    buffer.WriteU32(value.byteLength);
    buffer.Append(value);
  }

  static Decode(buffer)
  {
    const bytes = buffer.ReadU32();
    return new g.BigInt64Array(buffer.Extract(bytes));
  }
}

export class BigUint64Array extends g.BigUint64Array
{
  static Length(block)
  {
    const bytes = block.ReadU32();
    return 4 + block.Skip(bytes);
  }

  static Encode(block, value)
  {
    block.WriteU32(value.byteLength);
    block.Append(value);
  }

  static Decode(block)
  {
    const bytes = block.ReadU32();
    return block.Extract(g.BigUint64Array, bytes / BigUint64Array.BYTES_PER_ELEMENT);
  }
}
