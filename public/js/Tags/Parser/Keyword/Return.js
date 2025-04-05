import {Keyword} from "/js/Tags/Parser/Keyword.js";

export class Return extends Keyword
{
  // static GetLocalName(){ return "return"; }
  Parse(p){ return p.Read("return"); }
  Describe(){ return this.AddClass("return"); }
}
