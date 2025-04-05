import {Encoder} from "/js/Utility/Encoder.js";

export class BigUint64ArrayEncoder extends Encoder
{
  Encode(buffer, value)
  {
    buffer.WriteU32(value.byteLength);
    for (let i = 0; i < value.length; i++)
    {
      buffer.WriteU64(value[i]);
    }
  }

  Decode(buffer)
  {
    const bytes = buffer.ReadU32();
    const offset = buffer.GetOffset();
    buffer.Advance(bytes);
    return new BigUint64Array(buffer.buffer, offset, bytes);
  }

  GetType(){ return BigUint64Array; }
}
