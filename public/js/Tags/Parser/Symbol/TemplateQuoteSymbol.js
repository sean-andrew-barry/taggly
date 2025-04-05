import {Symbol} from "/js/Tags/Parser/Symbol.js";

export class TemplateQuoteSymbol extends Symbol
{
  Parse(p){ return p.Read("\`"); }

  Describe(){ return this.AddClass("quote", "quote-template"); }
}
