import {Symbol} from "/js/Tags/Token/Symbol.js";

export class OpenBrace extends Symbol
{
  Parse(p){ return p.Read("<"); }
}
