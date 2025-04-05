import {Symbol} from "/js/Tags/Parser/Symbol.js";

export class SingleLineComment extends Symbol
{
  Parse(p){ return p.Read("//"); }
}
