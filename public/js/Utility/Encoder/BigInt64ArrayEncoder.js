import {Encoder} from "/js/Utility/Encoder.js";

export class BigInt64ArrayEncoder extends Encoder
{
  Encode(buffer, value)
  {
    buffer.WriteU32(value.byteLength);
    for (let i = 0; i < value.length; i++)
    {
      buffer.WriteI64(value[i]);
    }
  }

  Decode(buffer)
  {
    const bytes = buffer.ReadU32();
    const offset = buffer.GetOffset();
    buffer.Advance(bytes);
    return new BigInt64Array(buffer.buffer, offset, bytes);
  }

  GetType(){ return BigInt64Array; }
}
