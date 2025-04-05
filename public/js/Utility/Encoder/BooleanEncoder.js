import {Encoder} from "/js/Utility/Encoder.js";

export class BooleanEncoder extends Encoder
{
  Encode(buffer, value)
  {
    if      (value === true ) buffer.WriteU8(1);
    else if (value === false) buffer.WriteU8(0);
  }

  Decode(buffer)
  {
    const boolean = buffer.ReadU8();

    if      (boolean === 1) return true;
    else if (boolean === 0) return false;
    else throw new Error(`Unknown buffer value of "${boolean}"`);
  }

  GetType(){ return Boolean; }
}
