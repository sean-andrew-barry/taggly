import {Symbol} from "/js/Tags/Parser/Symbol.js";

export class CurlyBraceCloseSymbol extends Symbol
{
  Parse(p){ return p.Read("}"); }
}
