import {Symbol} from "/js/Tags/Parser/Symbol.js";

export class ExactEqualsSymbol extends Symbol
{
  Parse(p){ return p.Read("==="); }

  Describe(){ return this.AddClass("logical", "equals", "exact"); }
}
