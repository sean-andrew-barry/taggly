import {Tag} from "/js/Tag.js";
import {Expression} from "/js/Tags/Parser/Expression.js";
import {ParameterExpression} from "/js/Tags/Parser/Expression/ParameterExpression.js";
import {New} from "/js/Tags/Parser/Keyword/New.js";
import {Identifier} from "/js/Tags/Parser/Identifier.js";

export class NewExpression extends Expression
{
  Parse(p)
  {
    // if (p.Match(New) && p.MatchExpression())
    // {
    //   return true;
    // }

    if (p.Match(New))
    {
      while (p.MatchExpression())
      {
      }

      return true;
    }

    return false;
  }

  Describe(){ return this.AddClass("new"); }
}
