import {Selector} from "/js/Token/CSS/Selector.js";
import {Identifier} from "/js/Token/Text/Identifier.js";
import {HashSymbol} from "/js/Token/Text/Symbol.js";

// Matches #id-name
export class IDSelector extends Selector
{
  Parse()
  {
    return this.Match(HashSymbol)
        && this.Match(Identifier);
  }
}