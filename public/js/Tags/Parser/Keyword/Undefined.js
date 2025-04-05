import {Keyword} from "/js/Tags/Parser/Keyword.js";

export class Undefined extends Keyword
{
  Parse(p){ return p.Read("undefined"); }

  // Describe(){ return this.AddClass("constant", "undefined"); }
  Describe(){ return this.AddClass("undefined"); }
}
