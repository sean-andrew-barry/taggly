import {Symbol} from "/js/Tags/Token/Symbol.js";

export class DoubleQuote extends Symbol
{
  Parse(p){ return p.Read("\""); }
}
