import {Keyword} from "/js/Tags/Parser/Keyword.js";

export class FromKeyword extends Keyword
{
  Parse(p){ return p.Read("from"); }

  Describe(){ return this.AddClass("from"); }
}
