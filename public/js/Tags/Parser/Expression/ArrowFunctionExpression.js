import {Tag} from "/js/Tag.js";
import {Expression} from "/js/Tags/Parser/Expression.js";
import {BlockStatement} from "/js/Tags/Parser/Statement/BlockStatement.js";
import {Identifier} from "/js/Tags/Parser/Identifier.js";
import {ArrowFunctionSymbol} from "/js/Tags/Parser/Symbol/ArrowFunctionSymbol.js";
import {ParameterExpression} from "/js/Tags/Parser/Expression/ParameterExpression.js";

export class ArrowFunctionExpression extends Expression
{
  Parse(p)
  {
    if (p.Match(ParameterExpression) || p.Match(Identifier))
    {
      if (p.Match(ArrowFunctionSymbol))
      {
        return p.Match(BlockStatement) || p.MatchExpression();
      }
    }

    return false;
  }

  Describe(){ return this.AddClass("function", "arrow"); }
}
