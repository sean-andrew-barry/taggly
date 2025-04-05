import {Tag} from "/js/Tag.js";
import {Statement} from "/js/Tags/Parser/Statement.js";
import {IfKeyword} from "/js/Tags/Parser/Keyword/IfKeyword.js";
import {Else} from "/js/Tags/Parser/Keyword/Else.js";
import {GroupExpression} from "/js/Tags/Parser/Expression/GroupExpression.js";
import {ParenthesisOpenSymbol} from "/js/Tags/Parser/Symbol/ParenthesisOpenSymbol.js";
import {ParenthesisCloseSymbol} from "/js/Tags/Parser/Symbol/ParenthesisCloseSymbol.js";

export class ElseIfStatement extends Statement
{
  Parse(p)
  {
    // if (p.Match(Else) && p.Match(IfKeyword) && p.Match(GroupExpression))
    // {
    //   return p.MatchStatement();
    // }

    if (p.Match(Else) && p.Match(IfKeyword) && p.Match(ParenthesisOpenSymbol))
    {
      while (!p.Match(ParenthesisCloseSymbol))
      {
        if (!p.MatchExpression())
        {
          break;
        }
      }

      return p.MatchExpression() || p.MatchStatement();
    }

    return false;
  }

  Describe(){ return this.AddClass("else", "if", "conditional", "controller"); }
}
