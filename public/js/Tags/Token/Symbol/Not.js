import {Symbol} from "/js/Tags/Token/Symbol.js";

export class Not extends Symbol
{
  Parse(p){ return p.Read("!"); }
}
