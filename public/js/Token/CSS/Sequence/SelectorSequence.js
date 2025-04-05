import {Sequence} from "/js/Token/CSS/Sequence.js";
// import {AttributeSelector} from "/js/Token/CSS/Selector/AttributeSelector.js";
// import {ClassSelector} from "/js/Token/CSS/Selector/ClassSelector.js";
// import {IDSelector} from "/js/Token/CSS/Selector/IDSelector.js";
// import {PseudoClassSelector} from "/js/Token/CSS/Selector/PseudoClassSelector.js";
// import {PseudoElementSelector} from "/js/Token/CSS/Selector/PseudoElementSelector.js";
// import {TypeSelector} from "/js/Token/CSS/Selector/TypeSelector.js";
// import {UniversalSelector} from "/js/Token/CSS/Selector/UniversalSelector.js";
import {CompoundSelector} from "/js/Token/CSS/Selector/CompoundSelector.js";
import {ChildCombinator, AdjacentSiblingCombinator, GeneralSiblingCombinator, DescendantCombinator} from "/js/Token/CSS/Combinator.js";

// This is a <complex-selector>
export class SelectorSequence extends Sequence
{
  MatchCombinator()
  {
    return this.Match(ChildCombinator)
        || this.Match(AdjacentSiblingCombinator)
        || this.Match(GeneralSiblingCombinator)
        || this.Match(DescendantCombinator) // Must be last because it is only made out of whitespace
        // || this.Error()
  }

  Parse()
  {
    try
    {
      // Match the first CompoundSelector; it must exist.
      if (!this.Match(CompoundSelector))
      {
        return false;
      }

      // Loop through the remaining sequence of [Combinator, CompoundSelector].
      while (this.IsParsing())
      {
        // Attempt to match a Combinator.
        if (!this.MatchCombinator())
        {
          break;
        }

        // If a Combinator was matched, a CompoundSelector must follow.
        if (!this.Match(CompoundSelector))
        {
          return false;
        }
      }

      return true;
    }
    catch (error)
    {
      console.error("Caught", error);
    }
  }
}

export class RelativeSelectorSequence extends SelectorSequence
{
  Parse()
  {
    // The leading combinator is optional
    return (this.MatchCombinator() || true) && super.Parse();
  }
}
