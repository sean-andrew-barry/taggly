import {Tag} from "/js/Tag.js";
import {Statement} from "/js/Tags/Parser/Statement.js";
import {Identifier} from "/js/Tags/Parser/Identifier.js";
import {ParameterExpression} from "/js/Tags/Parser/Expression/ParameterExpression.js";
import {BlockStatement} from "/js/Tags/Parser/Statement/BlockStatement.js";
import {AsyncKeyword} from "/js/Tags/Parser/Keyword/AsyncKeyword.js";
import {GeneratorSymbol} from "/js/Tags/Parser/Symbol/GeneratorSymbol.js";
import {EndSymbol} from "/js/Tags/Parser/Symbol/EndSymbol.js";

export class Method extends Statement
{
  Parse(p)
  {
    p.Match(AsyncKeyword);
    p.Match(GeneratorSymbol);

    if (!p.Match(Identifier)) return false;
    if (!p.Match(ParameterExpression)) return false;

    p.Match(EndSymbol);

    return p.Expect(BlockStatement);
  }

  Describe(){ return this.AddClass("method"); }
}
