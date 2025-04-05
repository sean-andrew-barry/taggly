import {Symbol} from "/js/Tags/Parser/Symbol.js";

export class Comma extends Symbol
{
  static GetLocalName(){ return "comma"; }
  Parse(p){ return p.Read(","); }
}
