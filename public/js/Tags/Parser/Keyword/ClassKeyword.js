import {Keyword} from "/js/Tags/Parser/Keyword.js";

export class ClassKeyword extends Keyword
{
  Parse(p){ return p.Read("class"); }

  Describe(){ return this.AddClass("class"); }
}
