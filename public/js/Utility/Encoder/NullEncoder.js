import {Encoder} from "/js/Utility/Encoder.js";
import {SymbolUtilities} from "/js/Utility/Symbol.js";

export class NullEncoder extends Encoder
{
  Encode(buffer, value)
  {
  }

  Decode(buffer)
  {
    return null;
  }

  GetType(){ return SymbolUtilities.GetNullClass(); }
}
