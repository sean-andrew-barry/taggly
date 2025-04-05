import {Encoder} from "/js/Utility/Encoder.js";
import {SymbolUtilities} from "/js/Utility/Symbol.js";

export class UndefinedEncoder extends Encoder
{
  Encode(buffer, value)
  {
  }

  Decode(buffer)
  {
    return undefined;
  }

  GetType(){ return SymbolUtilities.GetUndefinedClass(); }
}
