import {Encoder} from "/js/Utility/Encoder.js";

export class DateEncoder extends Encoder
{
  Encode(buffer, value)
  {
    buffer.WriteI64(value.getTime());
  }

  Decode(buffer)
  {
    return new Date(buffer.ReadI64());
  }

  GetType(){ return Date; }
}
