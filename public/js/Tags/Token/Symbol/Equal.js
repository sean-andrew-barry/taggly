import {Symbol} from "/js/Tags/Token/Symbol.js";

export class Equal extends Symbol
{
  Parse(p){ return p.Read("="); }
}
