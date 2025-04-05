import {Selector} from "/js/Token/CSS/Selector.js";
import {AttributeSelector} from "/js/Token/CSS/Selector/AttributeSelector.js";
import {ClassSelector} from "/js/Token/CSS/Selector/ClassSelector.js";
import {IDSelector} from "/js/Token/CSS/Selector/IDSelector.js";
import {TypeSelector} from "/js/Token/CSS/Selector/TypeSelector.js";
import {UniversalSelector} from "/js/Token/CSS/Selector/UniversalSelector.js";
import {PseudoClassSelector} from "/js/Token/CSS/Selector/PseudoClassSelector.js";
import {PseudoElementSelector} from "/js/Token/CSS/Selector/PseudoElementSelector.js";

export class CompoundSelector extends Selector
{
  MatchIDSelector()
  {
    // Already matched an IDSelector and only one is allowed
    if (this.matched_id === true) return false;

    if (this.Match(IDSelector))
    {
      this.matched_id = true;
      return true;
    }

    return false;
  }

  MatchRegularSelector()
  {
    // If we've matched a pseudo, we can't match any more regular selectors
    if (this.matched_pseudo) return false;

    return this.MatchIDSelector()
        || this.Match(AttributeSelector)
        || this.Match(ClassSelector);
  }

  MatchPseudoClassSelector()
  {
    // If we've matched an element, we can't match more classes cause element goes last
    if (this.matched_pseudo_element) return false;

    if (PseudoClassSelector.Parse(this))
    {
      this.matched_pseudo = true; // Matched ANY pseudo
      return true;
    }

    return false;
  }

  MatchPseudoElementSelector()
  {
    // Already matched a PseudoElementSelector and only one is allowed
    if (this.matched_pseudo_element) return false;

    if (PseudoElementSelector.Parse(this))
    {
      this.matched_pseudo = true; // Matched ANY pseudo
      this.matched_pseudo_element = true;
      return true;
    }

    return false;
  }

  MatchSelector()
  {
    return this.MatchRegularSelector()
        // Parse elements before classes! Otherwise some will parse wrong with the legacy single colon syntax
        || this.MatchPseudoElementSelector()
        || this.MatchPseudoClassSelector();
  }

  Parse()
  {
    // Capture optional Type or Universal selector at the beginning
    this.Match(TypeSelector) || this.Match(UniversalSelector);

    while (this.IsParsing() && this.MatchSelector())
    {
    }

    // Make sure we matched at least one
    return this.HasChildren();
  }
}