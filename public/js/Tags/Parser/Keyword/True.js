import {Keyword} from "/js/Tags/Parser/Keyword.js";

export class True extends Keyword
{
  Parse(p){ return p.Read("true"); }

  Describe(){ return this.AddClass("true"); }
}
