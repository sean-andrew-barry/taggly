import {Literal} from "/js/Token/Literal.js";
import {TrueKeyword, FalseKeyword} from "/js/Token/Text/Keyword.js";

export class BooleanLiteral extends Literal
{
  Parse()
  {
    return this.Match(TrueKeyword) || this.Match(FalseKeyword);
  }
}