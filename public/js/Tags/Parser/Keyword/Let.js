import {Keyword} from "/js/Tags/Parser/Keyword.js";

export class Let extends Keyword
{
  Parse(p){ return p.Read("let"); }
  Describe(){ return this.AddClass("let"); }
}
