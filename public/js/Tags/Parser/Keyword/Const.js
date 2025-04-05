import {Keyword} from "/js/Tags/Parser/Keyword.js";

export class Const extends Keyword
{
  Parse(p){ return p.Read("const"); }

  Describe(){ return this.AddClass("const"); }
}
