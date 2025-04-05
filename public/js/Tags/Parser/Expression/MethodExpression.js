import {Tag} from "/js/Tag.js";
import {Expression} from "/js/Tags/Parser/Expression.js";
import {Identifier} from "/js/Tags/Parser/Identifier.js";
import {ParameterExpression} from "/js/Tags/Parser/Expression/ParameterExpression.js";
import {BlockStatement} from "/js/Tags/Parser/Statement/BlockStatement.js";
import {AsyncKeyword} from "/js/Tags/Parser/Keyword/AsyncKeyword.js";
import {GeneratorSymbol} from "/js/Tags/Parser/Symbol/GeneratorSymbol.js";

export class MethodExpression extends Expression
{
  Parse(p)
  {
    p.Match(AsyncKeyword);
    p.Match(GeneratorSymbol);

    if (!p.Match(Identifier)) return false;
    if (!p.Match(ParameterExpression)) return false;

    return p.Expect(BlockStatement);
  }

  Describe(){ return this.AddClass("method", "function"); }
}
