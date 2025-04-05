import {Symbol} from "/js/Tags/Parser/Symbol.js";

export class BracketOpen extends Symbol
{
  static GetLocalName(){ return "bracket-open"; }
  Parse(p){ return p.Read("["); }
}
