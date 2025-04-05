import {Tag} from "/js/Tag.js";
import {Literal} from "/js/Tags/Parser/Literal.js";
import {DoubleQuoteSymbol} from "/js/Tags/Parser/Symbol/DoubleQuoteSymbol.js";
import {SingleQuoteSymbol} from "/js/Tags/Parser/Symbol/SingleQuoteSymbol.js";
import {TemplateQuoteSymbol} from "/js/Tags/Parser/Symbol/TemplateQuoteSymbol.js";
import {TemplateExpressionOpenSymbol} from "/js/Tags/Parser/Symbol/TemplateExpressionOpenSymbol.js";
import {TemplateExpressionCloseSymbol} from "/js/Tags/Parser/Symbol/TemplateExpressionCloseSymbol.js";
import {TemplateExpression} from "/js/Tags/Parser/Expression/TemplateExpression.js";

export class StringLiteral extends Literal
{
  Parse(parser)
  {
    let type;
    if      (parser.Match(DoubleQuoteSymbol  )) type = DoubleQuoteSymbol;
    else if (parser.Match(SingleQuoteSymbol  )) type = SingleQuoteSymbol;
    else if (parser.Match(TemplateQuoteSymbol)) type = TemplateQuoteSymbol;
    else return false;

    while (!parser.Match(type))
    {
      if (parser.IsDone()) return false;

      if (type === TemplateQuoteSymbol)
      {
        if (!parser.Match(TemplateExpression))
        {
        }
      }

      this.AppendText(parser.Take());
    }

    return true;
  }

  Describe(){ return this.AddClass("string"); }
}
