import {Tag} from "/js/Tag.js";
import {Statement} from "/js/Tags/Parser/Statement.js";
import {Const} from "/js/Tags/Parser/Keyword/Const.js";
import {Identifier} from "/js/Tags/Parser/Identifier.js";
import {EndSymbol} from "/js/Tags/Parser/Symbol/EndSymbol.js";

export class ConstStatement extends Statement
{
  Parse(p)
  {
    if (p.Match(Const) && p.Match(Identifier))
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

  Describe(){ return this.AddClass("const", "constant"); }
}
