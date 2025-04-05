import {Keyword} from "/js/Tags/Parser/Keyword.js";

export class Super extends Keyword
{
  static GetLocalName(){ return "super"; }
  Parse(p){ return p.Read("super"); }
  // Describe(){ return this.AddClass("super"); }
}
