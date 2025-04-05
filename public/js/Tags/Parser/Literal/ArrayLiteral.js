import {Tag} from "/js/Tag.js";
import {Literal} from "/js/Tags/Parser/Literal.js";
import {BracketOpen} from "/js/Tags/Parser/Symbol/BracketOpen.js";
import {BracketClose} from "/js/Tags/Parser/Symbol/BracketClose.js";
import {Comma} from "/js/Tags/Parser/Symbol/Comma.js";

export class ArrayLiteral extends Literal
{
  Parse(p)
  {
    if (!p.Match(BracketOpen)) return false;

    while (!p.Match(BracketClose))
    {
      if (p.IsDone()) return p.Throw(`ArrayLiteral expected a closing "]"`);

      if (p.MatchExpression())
      {
        if (p.Match(Comma))
        {
          continue;
        }

        // Didn't match a comma, so we must be at the end of the array literal
        if (p.Match(BracketClose))
        {
          return true;
        }
      }

      return false;
    }

    return true;
  }

  Describe(){ return this.AddClass("array"); }
}
