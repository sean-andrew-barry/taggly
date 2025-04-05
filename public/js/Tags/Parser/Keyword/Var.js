import {Keyword} from "/js/Tags/Parser/Keyword.js";

export class Var extends Keyword
{
  Parse(p){ return p.Read("var"); }
  Describe(){ return this.AddClass("var"); }
}
