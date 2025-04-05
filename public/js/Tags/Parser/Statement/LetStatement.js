import {Tag} from "/js/Tag.js";
import {Statement} from "/js/Tags/Parser/Statement.js";
import {Let} from "/js/Tags/Parser/Keyword/Let.js";
import {EndSymbol} from "/js/Tags/Parser/Symbol/EndSymbol.js";
import {Identifier} from "/js/Tags/Parser/Identifier.js";

export class LetStatement extends Statement
{
  Parse(p)
  {
    if (p.Match(Let) && p.Match(Identifier))
    {
      while (p.MatchExpression())
      {
        if (p.Match(EndSymbol)) return true;
      }

      p.Match(EndSymbol);
      return true;
    }

    return false;
  }

  Describe(){ return this.AddClass("let", "variable"); }
}
