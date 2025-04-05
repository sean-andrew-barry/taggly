import {Tag} from "/js/Tag.js";
import {Statement} from "/js/Tags/Parser/Statement.js";
import {ForKeyword} from "/js/Tags/Parser/Keyword/ForKeyword.js";
import {GroupExpression} from "/js/Tags/Parser/Expression/GroupExpression.js";

export class ForStatement extends Statement
{
  Parse(p)
  {
    // TODO
    if (p.Match(ForKeyword) && p.Match(GroupExpression))
    {
      return p.MatchStatement();
    }

    return false;
  }

  Describe(){ return this.AddClass("for"); }
}
