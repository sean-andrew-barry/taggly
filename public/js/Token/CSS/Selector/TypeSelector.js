import {Selector} from "/js/Token/CSS/Selector.js";
import {Text} from "/js/Token/Text.js";

// Matches div, span, etc
export class TypeSelector extends Selector
{
  Parse()
  {
    if (!this.IsAlphaAt()) return false;
    
    const text = Text.From(this);
    text.Step();

    while (text.IsParsing())
    {
      const c = text.Peek();

      if (c === "-")
      {
        this.is_custom = true;
      }
      else if (!text.IsAlphaAt() && !text.IsDigitAt())
      {
        break;
      }

      text.Step();
    }

    this.Append(text);

    return true;
  }

  // Lowercase because that's what the HTML5 spec calls for, is invalid for other things like XHTML
  GetText(){ return super.GetText().toLowerCase(); }
}