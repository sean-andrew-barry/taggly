import {StringUtilities} from "/js/Utility/String.js";

const CODE = Symbol("code");

export class Encoder
{
  Encode(buffer, value)
  {
    throw new Error(`Encoder.Encode must be overridden`);
  }

  Decode(buffer)
  {
    throw new Error(`Encoder.Decode must be overridden`);
  }

  SetCode()
  {
    const type = this.GetType();
    const code = StringUtilities.Hash16(type.name);

    return this[CODE] = code;
  }

  GetType(){ throw new Error(`Encoder.GetType must be overridden`); }
  GetCode(){ return this[CODE] || this.SetCode(); }
}
