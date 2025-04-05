import {Encoder} from "/js/Utility/Encoder.js";

export class ObjectEncoder extends Encoder
{
  Encode(buffer, value)
  {
    // We don't know the size yet, so simply put a 0 for now
    const start = buffer.WriteU32(0);

    const keys = Object.keys(value);
    for (let i = 0; i < keys.length; i++)
    {
      const key = keys[i];

      buffer.Write(key); // Include the code, since keys can be numbers
      buffer.Write(value[key]);
    }

    const size = buffer.GetOffset() - start;

    // Now that we know the size, overwrite that 0 with the real size
    buffer.WriteU32(size, start, false);
  }

  Decode(buffer)
  {
    const object = {};
    const start = buffer.GetOffset();
    const size = buffer.ReadU32();
    const offset = start + size;

    while (offset > buffer.GetOffset())
    {
      const key = buffer.Read();
      const val = buffer.Read();

      object[key] = val;
    }

    return object;
  }

  GetType(){ return Object; }
}
