import {Symbol} from "/js/Tags/Parser/Symbol.js";

export class SingleQuoteSymbol extends Symbol
{
  Parse(p){ return p.Read("\'"); }

  Describe(){ return this.AddClass("quote", "quote-single"); }
}
