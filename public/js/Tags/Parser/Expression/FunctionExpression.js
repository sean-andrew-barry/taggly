import {Tag} from "/js/Tag.js";
import {Expression} from "/js/Tags/Parser/Expression.js";
import {Identifier} from "/js/Tags/Parser/Identifier.js";
import {BlockStatement} from "/js/Tags/Parser/Statement/BlockStatement.js";
import {AsyncKeyword} from "/js/Tags/Parser/Keyword/AsyncKeyword.js";
import {Function} from "/js/Tags/Parser/Keyword/Function.js";
import {GeneratorSymbol} from "/js/Tags/Parser/Symbol/GeneratorSymbol.js";
import {ParameterExpression} from "/js/Tags/Parser/Expression/ParameterExpression.js";

export class FunctionExpression extends Expression
{
  Parse(p)
  {
    p.Match(AsyncKeyword);
    p.Match(GeneratorSymbol);

    if (!p.Match(Function)) return false;

    p.Match(Identifier); // Optional

    if (!p.Match(ParameterExpression)) return false;

    return p.Expect(BlockStatement);
  }

  Describe(){ return this.AddClass("function"); }
}
