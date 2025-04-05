import {String} from "/js/String.js";
import {Uint8Array} from "/js/TypedArray.js";

// This represents an imported ES Module
export class Module
{
  static Length(block)
  {
    return block.SkipU16() + String.Length(block) + Uint8Array.Length(block);
  }

  static Encode(block, mod)
  {
    block.WriteU16(mod.GetFlags());
    String.Encode(block, mod.GetURL());
    Uint8Array.Encode(block, mod.GetData());
  }

  static Decode(block)
  {
    const flags = block.ReadU16();
    const url = String.Decode(block);
    const data = Uint8Array.Decode(block);

    return new this(flags, url, data);
  }
}