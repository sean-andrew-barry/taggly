import {Symbol} from "/js/Tags/Parser/Symbol.js";

export class ParenthesisOpenSymbol extends Symbol
{
  Parse(p){ return p.Read("("); }
}
