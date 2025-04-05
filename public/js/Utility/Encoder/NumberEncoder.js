import {Encoder} from "/js/Utility/Encoder.js";

export class NumberEncoder extends Encoder
{
  Encode(buffer, value)
  {
    buffer.WriteF64(value);
  }

  Decode(buffer)
  {
    return buffer.ReadF64();
  }

  GetType(){ return Number; }
}
