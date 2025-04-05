import {Keyword} from "/js/Tags/Parser/Keyword.js";

export class InstanceOf extends Keyword
{
  // static GetLocalName(){ return "instanceof"; }

  Parse(p){ return p.Read("instanceof"); }
  Describe(){ return this.AddClass("instanceof"); }
}
