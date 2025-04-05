import {Tag} from "/js/Tag.js";
import {Statement} from "/js/Tags/Parser/Statement.js";
import {FunctionExpression} from "/js/Tags/Parser/Expression/FunctionExpression.js";

export class FunctionStatement extends Statement
{
  Parse(p)
  {
    return p.Match(FunctionExpression);
  }

  Describe(){ return this.AddClass("function", "declaration"); }
}
