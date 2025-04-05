import {Encoder} from "/js/Utility/Encoder.js";
import {Binary} from "/js/Utility/Database/Binary.js";

export class BinaryEncoder extends Encoder
{
  Encode(buffer, value)
  {
    const start = buffer.WriteU32(0);
    // const {position, buffer} = value;

    for (let i = 0; i < value.position; i++)
    {
      buffer.WriteU8(value.buffer[i]);
    }

    // Now that we know the size, overwrite that 0 with the real size
    buffer.WriteU32(buffer.GetOffset(), start, false);
  }

  Decode(buffer)
  {
    const end = buffer.ReadU32();
    const offset = buffer.GetOffset();
    buffer.Move(end);

    const new_buffer = new Uint8Array(buffer.buffer, offset, end - offset);
    return new Binary(new_buffer);
  }

  GetType(){ return Binary; }
}
