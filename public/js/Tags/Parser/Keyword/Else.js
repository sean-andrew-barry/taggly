import {Keyword} from "/js/Tags/Parser/Keyword.js";

export class Else extends Keyword
{
  Parse(p){ return p.Read("else"); }
  Describe(){ return this.AddClass("else"); }
}
