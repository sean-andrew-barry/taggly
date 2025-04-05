import {Keyword} from "/js/Tags/Parser/Keyword.js";

export class Function extends Keyword
{
  Parse(p){ return p.Read("function"); }
  Describe(){ return this.AddClass("function"); }
}
