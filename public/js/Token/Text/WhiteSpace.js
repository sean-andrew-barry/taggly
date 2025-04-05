import {Text} from "/js/Token/Text.js";

export class WhiteSpace extends Text
{
  Parse()
  {
    while (this.IsParsing() && this.IsSpaceAt())
    {
      this.Step();
    }

    return this.GetLength() > 0;
  }
}