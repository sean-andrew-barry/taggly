import {Tag} from "/js/Tag.js";
import {Expression} from "/js/Tags/Parser/Expression.js";
import {Identifier} from "/js/Tags/Parser/Identifier.js";
import {AssignmentSymbol} from "/js/Tags/Parser/Symbol/AssignmentSymbol.js";
import {Comma} from "/js/Tags/Parser/Symbol/Comma.js";
import {ParenthesisOpenSymbol} from "/js/Tags/Parser/Symbol/ParenthesisOpenSymbol.js";
import {ParenthesisCloseSymbol} from "/js/Tags/Parser/Symbol/ParenthesisCloseSymbol.js";

export class ParameterExpression extends Expression
{
  Parse(p)
  {
    if (!p.Match(ParenthesisOpenSymbol)) return false;

    while (!p.Match(ParenthesisCloseSymbol))
    {
      if (p.IsAtEnd()) return p.Throw(`ParameterExpression expected to find closing ")"`);

      if (p.Match(Identifier))
      {
        if (this.Match(AssignmentSymbol))
        {
          this.MatchExpression(); // Do we care if it matches or not?
        }

        if (!p.Match(Comma))
        {
          p.Expect(ParenthesisCloseSymbol);
          break;
        }
      }
      else
      {
        return false;
      }
    }

    return true;
  }

  Parse(p)
  {
    if (!p.Match(ParenthesisOpenSymbol)) return false;

    while (!p.Match(ParenthesisCloseSymbol))
    {
      if (p.IsAtEnd()) return p.Throw(`ParameterExpression expected to find closing ")"`);

      if (p.Match(Identifier))
      {
        if (p.Match(AssignmentSymbol))
        {
          p.MatchExpression(); // Do we care if it matches or not?
        }

        if (!p.Match(Comma))
        {
          return p.Match(ParenthesisCloseSymbol);
        }
      }
      else
      {
        return false;
      }
    }

    return true;
  }

  Describe(){ return this.AddClass("parameters"); }
}
