import {String} from "/js/String.js";

const GlobalRegExp = globalThis.RegExp;

export class RegExp extends GlobalRegExp
{
  static Encode(buffer, value)
  {
    // String.Encode(buffer, value.source);
    // String.Encode(buffer, value.flags);
    buffer.EncodeString(value.source);
    buffer.EncodeString(value.flags);
  }

  static Decode(buffer)
  {
    // const source = String.Decode(buffer);
    // const flags  = String.Decode(buffer);
    const source = buffer.DecodeString();
    const flags  = buffer.DecodeString();

    return new GlobalRegExp(source, flags);
  }
}
