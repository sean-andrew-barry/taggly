import {Escape} from "/js/Token/Text/Escape.js";

export class HexadecimalEscape extends Escape
{
  GetMaxHexLength(){ return 6; }

  Parse()
  {
    if (!this.IsStartCharacter()) return false;

    this.Step();

    let hex = "";
    for (let i = 0; i < this.GetMaxHexLength(); i++)
    {
      if (!this.IsParsing()) break;

      const c = this.Peek();
      if (!this.IsHex(c))
      {
        if (i === 0) return false; // An escape sequence must start with a hexadecimal digit.
        if (this.IsSpace()) this.Step(); // Consume the white space after the escape sequence.
        break;
      }

      hex += c;
      this.Step();
    }

    // Convert the hex to a Unicode character
    this.SetText(String.fromCodePoint(parseInt(hex, 16)));

    return true;
  }
}