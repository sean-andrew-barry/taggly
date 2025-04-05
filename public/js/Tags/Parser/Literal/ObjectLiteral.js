import {Tag} from "/js/Tag.js";
import {Literal} from "/js/Tags/Parser/Literal.js";
import {Identifier} from "/js/Tags/Parser/Identifier.js";
import {IdentifierExpression} from "/js/Tags/Parser/Expression/IdentifierExpression.js";
import {CurlyBraceOpenSymbol} from "/js/Tags/Parser/Symbol/CurlyBraceOpenSymbol.js";
import {CurlyBraceCloseSymbol} from "/js/Tags/Parser/Symbol/CurlyBraceCloseSymbol.js";
import {ColonSymbol} from "/js/Tags/Parser/Symbol/ColonSymbol.js";

export class ObjectLiteral extends Literal
{
  Parse(p)
  {
    if (!p.Match(CurlyBraceOpenSymbol)) return false;

    while (!p.Match(CurlyBraceCloseSymbol))
    {
      if (p.IsDone()) return p.Throw(`ObjectLiteral expected a closing "}"`);

      if (p.Match(IdentifierExpression) || p.Match(Identifier))
      {
        if (p.Match(ColonSymbol) && p.MatchExpression())
        {
          continue;
        }
      }

      return false;
    }

    return true;
  }

  Describe(){ return this.AddClass("object"); }
}
