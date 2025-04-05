import {Literal} from "/js/Token/Literal.js";
import {Text} from "/js/Token/Text.js";
import {SingleQuoteSymbol, DoubleQuoteSymbol} from "/js/Token/Text/Symbol.js";
import {CharacterEscape} from "/js/Token/Text/Escape/CharacterEscape.js";

export class StringLiteral extends Literal
{
  IsEscapeCharacter(c = this.Peek())
  {
    return c === "\\";
  }

  Parse()
  {
    try
    {
      // Checks if the starting character is a quote symbol and identifies which type.
      let type;
      if      (this.Match(DoubleQuoteSymbol)) type = DoubleQuoteSymbol;
      else if (this.Match(SingleQuoteSymbol)) type = SingleQuoteSymbol;
      else return false;

      let text;
      while (true)
      {
        // Initiates a new Text token to capture the string contents, if it doesn't exist.
        text ??= Text.From(this);

        // Make sure we haven't reached the end without finding the closing quote.
        if (!text.IsParsing()) return false;

        // Attempt to match an escape sequence.
        if (this.IsEscapeCharacter(text.Peek())) 
        {
          // console.log("Hit escape?");

          // If we have matched any text, append it before parsing the escape to preserve the order
          if (text.GetLength() > 0)
          {
            this.Append(text);
            text = undefined; // Reset text so it can be reinitialized next loop
          }

          if (this.Match(CharacterEscape)) continue; // If successful, Match appends the CharacterEscape token
          else return false; // Failed to parse escape sequence.
        }
        else
        {
          // Check for the end of the string (the closing quote).
          const end = text.Test(type);
          if (end) 
          {
            // console.log("Hit end character!");
    
            if (text.GetLength() > 0)
            {
              this.Append(text);
            }

            this.Append(end);

            // The string is complete; return successfully.
            return true;
          }

          // console.log("Matching", text.Peek());

          // Add the next character to the text.
          text.Step();
        }
      }
    }
    catch (error)
    {
      console.error("Caught", error);
    }
  }
}
