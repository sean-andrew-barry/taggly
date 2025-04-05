import {Encoder} from "/js/Utility/Encoder.js";

export class Int16ArrayEncoder extends Encoder
{
  Encode(buffer, value)
  {
    buffer.WriteU32(value.byteLength);
    for (let i = 0; i < value.length; i++)
    {
      buffer.WriteI16(value[i]);
    }
  }

  Decode(buffer)
  {
    const bytes = buffer.ReadU32();
    const offset = buffer.GetOffset();
    buffer.Advance(bytes);
    return new Int16Array(buffer.GetBuffer(), offset, bytes);
  }

  GetType(){ return Int16Array; }
}
