import {Selector} from "/js/Token/CSS/Selector.js";
import {Identifier} from "/js/Token/Text/Identifier.js";
import {DotSymbol} from "/js/Token/Text/Symbol.js";

// Matches .class-name
export class ClassSelector extends Selector
{
  Parse()
  {
    return this.Match(DotSymbol)
        && this.Match(Identifier);
  }
}