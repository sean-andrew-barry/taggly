import {Symbol} from "/js/Tags/Parser/Symbol.js";

export class DoubleQuoteSymbol extends Symbol
{
  Parse(p){ return p.Read("\""); }

  Describe(){ return this.AddClass("quote", "quote-double"); }
}
