import {Tag} from "/js/Tag.js";
import {Expression} from "/js/Tags/Parser/Expression.js";
import {TemplateExpressionOpenSymbol} from "/js/Tags/Parser/Symbol/TemplateExpressionOpenSymbol.js";
import {TemplateExpressionCloseSymbol} from "/js/Tags/Parser/Symbol/TemplateExpressionCloseSymbol.js";

export class TemplateExpression extends Expression
{
  Parse(parser)
  {
    if (!parser.Match(TemplateExpressionOpenSymbol)) return false;

    while (!parser.Match(TemplateExpressionCloseSymbol))
    {
      if (parser.IsDone()) return false;

      if (!parser.MatchExpression())
      {
        break;
      }
    }

    return true;
  }

  Describe(){ return this.AddClass("template"); }
}
