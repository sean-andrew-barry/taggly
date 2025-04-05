import {Symbol} from "/js/Tags/Token/Symbol.js";

export class Slash extends Symbol
{
  Parse(p){ return p.Read("/"); }
}
