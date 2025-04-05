import {Symbol} from "/js/Tags/Parser/Symbol.js";

export class EndSymbol extends Symbol
{
  Parse(p){ return p.Read(";"); }
}
