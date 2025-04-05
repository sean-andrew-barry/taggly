import {Symbol} from "/js/Tags/Parser/Symbol.js";

export class GeneratorSymbol extends Symbol
{
  Parse(p){ return p.Read("*"); }
}
