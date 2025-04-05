import {Symbol} from "/js/Tags/Parser/Symbol.js";

export class NotEqualsSymbol extends Symbol
{
  Parse(p){ return p.Read("!="); }

  // Describe(){ return this.AddClass("logical", "operator", "unary", "not"); }
}
