import {Token} from "/js/Token.js";
import {Text} from "/js/Token/Text.js";
import {HexadecimalEscape} from "/js/Token/Text/Escape/HexadecimalEscape.js";

export class Identifier extends Token
{
  IsEscapeCharacter(c = this.Peek())
  {
    return c === "\\";
  }

  IsStartCharacter(c = this.Peek())
  {
    if (this.IsEscapeCharacter(c)) return this.Match(HexadecimalEscape);
    else if (c === "_") return true;
    else if (this.IsAlpha(c)) return true;
    else if (c === "-")
    {
      const next = this.Peek(1);
      return next === "_" || this.IsAlpha(next);
    }
    else
    {
      return false;
    }
  }

  IsValidCharacter(c = this.Peek())
  {
    return c === "_" || c === "-" || this.IsAlNum(c);
  }

  Parse()
  {
    try
    {
      if (!this.IsStartCharacter()) return false;

      while (this.IsParsing())
      {
        if (this.IsEscapeCharacter(this.Peek()))
        {
          if (this.Match(HexadecimalEscape))
          {
            continue;
          }

          // Handle error: Failed to parse escape sequence
          return false;
        }
        
        let text = Text.From(this);
        while (this.IsValidCharacter(text.Peek()))
        {
          text.Step();
        }
        
        if (text.GetLength() > 0)
        {
          this.Append(text);
        }
        else
        {
          break;
        }
      }

      return this.HasChildren();
    }
    catch (error)
    {
      console.error("Caught", error);
    }
  }
}