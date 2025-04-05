import {Selector} from "/js/Token/CSS/Selector.js";
import {CompoundSelector} from "/js/Token/CSS/Selector/CompoundSelector.js";
import {ChildCombinator, AdjacentSiblingCombinator, GeneralSiblingCombinator, DescendantCombinator} from "/js/Token/CSS/Combinator.js";

export class ComplexSelector extends Selector
{
  Parse()
  {
    while (this.IsParsing() && this.MatchSelector())
    {
      if (!this.IsParsing())
      {
        throw new Error(`Unexpected end of file`);
      }
    }

    // Make sure we matched at least one
    return this.HasChildren();
  }
}