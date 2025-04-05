import {Tag} from "/js/Tag.js";
import {Statement} from "/js/Tags/Parser/Statement.js";
import {Return} from "/js/Tags/Parser/Keyword/Return.js";
import {EndSymbol} from "/js/Tags/Parser/Symbol/EndSymbol.js";

export class ReturnStatement extends Statement
{
  Parse(p)
  {
    if (p.Match(Return))
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

  Describe(){ return this.AddClass("controller", "return"); }
}
