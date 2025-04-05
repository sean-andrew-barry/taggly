import {Tag} from "/js/Tag.js";
import {Statement} from "/js/Tags/Parser/Statement.js";
import {ClassExpression} from "/js/Tags/Parser/Expression/ClassExpression.js";

export class ClassStatement extends Statement
{
  Parse(p)
  {
    console.log("Parsing ClassStatement");
    return p.Match(ClassExpression);
  }

  Describe(){ return this.AddClass("class", "declaration"); }
}
