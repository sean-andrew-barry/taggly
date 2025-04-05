import {Keyword} from "/js/Tags/Parser/Keyword.js";

export class NaN extends Keyword
{
  Parse(p){ return p.Read("NaN"); }

  // Describe(){ return this.AddClass("constant", "undefined"); }
  Describe(){ return this.AddClass("nan", "constant"); }
}
