import {Tag} from "/js/Tag.js";
import {Literal} from "/js/Tags/Parser/Literal.js";
import {True} from "/js/Tags/Parser/Keyword/True.js";
import {False} from "/js/Tags/Parser/Keyword/False.js";

export class BooleanLiteral extends Literal
{
  Parse(p)
  {
    if (p.Match(True) || p.Match(False))
    {
      return true;
    }

    return false;
  }

  Describe(){ return this.AddClass("boolean", "constant"); }
}
