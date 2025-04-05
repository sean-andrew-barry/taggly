import {Symbol} from "/js/Tags/Parser/Symbol.js";

export class BracketClose extends Symbol
{
  static GetLocalName(){ return "bracket-close"; }
  Parse(p){ return p.Read("]"); }
}
