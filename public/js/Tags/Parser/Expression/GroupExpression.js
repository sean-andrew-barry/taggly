import {Tag} from "/js/Tag.js";
import {Expression} from "/js/Tags/Parser/Expression.js";
import {ParenthesisOpenSymbol} from "/js/Tags/Parser/Symbol/ParenthesisOpenSymbol.js";
import {ParenthesisCloseSymbol} from "/js/Tags/Parser/Symbol/ParenthesisCloseSymbol.js";

export class GroupExpression extends Expression
{
  Parse(parser)
  {
    if (!parser.Match(ParenthesisOpenSymbol)) return false;

    while (!parser.Match(ParenthesisCloseSymbol))
    {
      if (parser.IsDone()) return parser.Throw(`GroupExpression expected to find closing ")"`);

      if (!parser.MatchExpression())
      {
        return false;
      }
    }

    return true;
  }

  Describe(){ return this.AddClass("group"); }
}
