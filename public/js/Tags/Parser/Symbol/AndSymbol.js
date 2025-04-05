import {Symbol} from "/js/Tags/Parser/Symbol.js";

export class AndSymbol extends Symbol
{
  Parse(p){ return p.Read("&&"); }

  Describe(){ return this.AddClass("logical", "operator", "binary", "and"); }
}
