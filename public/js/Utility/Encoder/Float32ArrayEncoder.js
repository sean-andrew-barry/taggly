import {Encoder} from "/js/Utility/Encoder.js";

export class Float32ArrayEncoder extends Encoder
{
  Encode(buffer, value)
  {
    buffer.WriteU32(value.byteLength);
    for (let i = 0; i < value.length; i++)
    {
      buffer.WriteF32(value[i]);
    }
  }

  Decode(buffer)
  {
    const bytes = buffer.ReadU32();
    const offset = buffer.GetOffset();
    buffer.Advance(bytes);
    return new Float32Array(buffer.buffer, offset, bytes);
  }

  GetType(){ return Float32Array; }
}
