import {Keyword} from "/js/Tags/Parser/Keyword.js";

export class Null extends Keyword
{
  Parse(p){ return p.Read("null"); }
  Describe(){ return this.AddClass("null"); }
}
