import {Symbol} from "/js/Tags/Token/Symbol.js";

export class SingleQuote extends Symbol
{
  Parse(p){ return p.Read("'"); }
}
