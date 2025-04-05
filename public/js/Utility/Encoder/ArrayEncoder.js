import {Encoder} from "/js/Utility/Encoder.js";

export class ArrayEncoder extends Encoder
{
  Encode(buffer, value)
  {
    // We don't know the size yet, so simply put a 0 for now
    const start = buffer.WriteU32(0);

    for (let i = 0; i < value.length; i++)
    {
      buffer.Write(value[i]);
    }

    const size = buffer.GetOffset() - start;

    // Now that we know the size, overwrite that 0 with the real size
    buffer.WriteU32(size, start, false);
  }

  Decode(buffer)
  {
    const array = [];
    const start = buffer.GetOffset();
    const size = buffer.ReadU32();
    const offset = start + size;

    while (offset > buffer.GetOffset())
    {
      const element = buffer.Read();
      array.push(element);
    }

    return array;
  }

  GetType(){ return Array; }
}
