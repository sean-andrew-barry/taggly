import {Tag} from "/js/Tag.js";
import {Expression} from "/js/Tags/Parser/Expression.js";
import {ParameterExpression} from "/js/Tags/Parser/Expression/ParameterExpression.js";
import {Identifier} from "/js/Tags/Parser/Identifier.js";

export class CallExpression extends Expression
{
  Parse(p)
  {
    if (p.Match(Identifier) && p.Match(ParameterExpression))
    {
      return true;
    }

    return false;
  }

  Describe(){ return this.AddClass("call"); }
}
