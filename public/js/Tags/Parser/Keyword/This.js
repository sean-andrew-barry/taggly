import {Keyword} from "/js/Tags/Parser/Keyword.js";

export class This extends Keyword
{
  // static GetLocalName(){ return "this"; }
  Parse(p){ return p.Read("this"); }

  Describe(){ return this.AddClass("this"); }
}
