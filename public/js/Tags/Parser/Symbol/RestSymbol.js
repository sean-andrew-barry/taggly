import {Symbol} from "/js/Tags/Parser/Symbol.js";

export class RestSymbol extends Symbol
{
  Parse(p){ return p.Read("..."); }
}
