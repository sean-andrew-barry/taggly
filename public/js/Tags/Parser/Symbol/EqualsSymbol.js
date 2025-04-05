import {Symbol} from "/js/Tags/Parser/Symbol.js";

export class EqualsSymbol extends Symbol
{
  Parse(p){ return p.Read("=="); }

  Describe(){ return this.AddClass("logical", "equals"); }
}
