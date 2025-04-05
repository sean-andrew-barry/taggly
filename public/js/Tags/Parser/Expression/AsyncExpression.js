import {Tag} from "/js/Tag.js";
import {Expression} from "/js/Tags/Parser/Expression.js";
import {AsyncKeyword} from "/js/Tags/Parser/Keyword/AsyncKeyword.js";
import {Identifier} from "/js/Tags/Parser/Identifier.js";

export class AsyncExpression extends Expression
{
  Parse(p)
  {
    if (p.Match(AsyncKeyword) && p.MatchExpression())
    {
      return true;
    }

    return false;
  }

  Describe(){ return this.AddClass("async"); }
}
