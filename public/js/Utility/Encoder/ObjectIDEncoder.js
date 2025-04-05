import {Encoder} from "/js/Utility/Encoder.js";
import {ObjectID} from "/js/Utility/Database/ObjectID.js";

export class ObjectIDEncoder extends Encoder
{
  Encode(buffer, value)
  {
    const id = value.id;
    for (let i = 0; i < id.length; i++)
    {
      buffer.WriteU8(id[i]);
    }
  }

  Decode(buffer)
  {
    const data = new Uint8Array(buffer.GetBuffer(), buffer.GetOffset(), 12);
    buffer.Advance(12);

    const str = data.reduce((str, byte) => str + byte.toString(16).padStart(2, "0"), "");
    return new ObjectID(str);
  }

  GetType(){ return ObjectID; }
}
