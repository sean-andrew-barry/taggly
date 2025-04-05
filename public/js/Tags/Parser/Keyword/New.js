import {Keyword} from "/js/Tags/Parser/Keyword.js";

export class New extends Keyword
{
  Parse(p){ return p.Read("new"); }
  Describe(){ return this.AddClass("new"); }
}
