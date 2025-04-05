import {Keyword} from "/js/Tags/Parser/Keyword.js";

export class ExtendsKeyword extends Keyword
{
  Parse(p){ return p.Read("extends"); }

  Describe(){ return this.AddClass("extends"); }
}
