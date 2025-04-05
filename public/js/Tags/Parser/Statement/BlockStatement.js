import {Tag} from "/js/Tag.js";
import {Statement} from "/js/Tags/Parser/Statement.js";
import {CurlyBraceOpenSymbol} from "/js/Tags/Parser/Symbol/CurlyBraceOpenSymbol.js";
import {CurlyBraceCloseSymbol} from "/js/Tags/Parser/Symbol/CurlyBraceCloseSymbol.js";
import {EndSymbol} from "/js/Tags/Parser/Symbol/EndSymbol.js";

export class BlockStatement extends Statement
{
  Parse(p)
  {
    if (!p.Match(CurlyBraceOpenSymbol)) return false;

    while (!p.Match(CurlyBraceCloseSymbol))
    {
      if (p.IsAtEnd()) return p.Throw(`BlockStatement expected to find closing "}"`);

      if (p.MatchStatement())
      {
        p.Match(EndSymbol); // Optional
      }
      else
      {
        // console.warn("Block failed to match a statement!");
        p.Match(EndSymbol); // Optional
        break;
      }
    }

    return true;
  }

  Describe(){ return this.AddClass("block"); }
}
