import {Selector} from "/js/Token/CSS/Selector.js";
import {AsteriskSymbol} from "/js/Token/Text/Symbol.js";

// Matches *
export class UniversalSelector extends Selector
{
  Parse()
  {
    return this.Match(AsteriskSymbol);
  }
}