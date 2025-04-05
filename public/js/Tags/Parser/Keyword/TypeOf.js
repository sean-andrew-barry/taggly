import {Keyword} from "/js/Tags/Parser/Keyword.js";

export class TypeOf extends Keyword
{
  // static GetLocalName(){ return "typeof"; }

  Parse(p){ return p.Read("typeof"); }
  Describe(){ return this.AddClass("typeof"); }
}
