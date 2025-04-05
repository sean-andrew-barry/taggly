import {Encoder} from "/js/Utility/Encoder.js";

export class Float64ArrayEncoder extends Encoder
{
  Encode(buffer, value)
  {
    buffer.WriteU32(value.byteLength);
    for (let i = 0; i < value.length; i++)
    {
      buffer.WriteF64(value[i]);
    }
  }

  Decode(buffer)
  {
    const bytes = buffer.ReadU32();
    const offset = buffer.GetOffset();
    buffer.Advance(bytes);
    return new Float64Array(buffer.buffer, offset, bytes);
  }

  GetType(){ return Float64Array; }
}
