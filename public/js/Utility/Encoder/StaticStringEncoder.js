import {Encoder} from "/js/Utility/Encoder.js";
import {StaticString} from "/js/Utility/StaticString.js";

export class StaticStringEncoder extends Encoder
{
  Encode(buffer, value)
  {
    const code = StaticString.Get(value);
    buffer.WriteU16(code);
  }

  Decode(buffer)
  {
    const code = buffer.ReadU16();
    const string = StaticString.Get(code);

    return string;
  }

  GetType(){ return StaticString; }
}
