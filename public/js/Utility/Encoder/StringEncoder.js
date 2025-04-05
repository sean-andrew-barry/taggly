import {Encoder} from "/js/Utility/Encoder.js";

export class StringEncoder extends Encoder
{
  Encode(buffer, value)
  {
    buffer.WriteU16(value.length);

    for (let i = 0; i < value.length; i++)
    {
      buffer.WriteU16(value.charCodeAt(i));
    }
  }

  Decode(buffer)
  {
    let string = "";

    const size = buffer.ReadU16();
    for (let i = 0; i < size; i++)
    {
      string += String.fromCharCode(buffer.ReadU16());
    }

    return string;
  }

  GetType(){ return String; }
}
