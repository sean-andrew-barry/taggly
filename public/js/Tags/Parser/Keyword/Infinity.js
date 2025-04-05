import {Keyword} from "/js/Tags/Parser/Keyword.js";

export class Infinity extends Keyword
{
  Parse(p){ return p.Read("Infinity"); }

  // Describe(){ return this.AddClass("constant", "undefined"); }
  Describe(){ return this.AddClass("infinity", "constant"); }
}
