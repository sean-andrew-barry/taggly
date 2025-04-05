import {Symbol} from "/js/Tags/Parser/Symbol.js";

export class Indent extends Symbol
{
  // static GetLocalName(){ return "indent"; }

  Parse(parser){ return parser.Read("  "); }

  Describe(){ return this.AddClass("indent"); }
}
