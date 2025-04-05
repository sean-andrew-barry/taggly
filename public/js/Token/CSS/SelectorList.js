import {CSS} from "/js/Token/CSS.js";
import {SelectorSequence, RelativeSelectorSequence} from "/js/Token/CSS/Sequence/SelectorSequence.js";
import {CommaSymbol} from "/js/Token/Text/Symbol.js";

// This is a <complex-selector-list>
export class SelectorList extends CSS
{
  MatchComma()
  {
    return this.MultiLineCommentSequence()
        && this.Match(CommaSymbol)
        && this.MultiLineCommentSequence()
  }

  Parse()
  {
    while (this.IsParsing() && this.Match(SelectorSequence) && this.MatchComma())
    {
      // console.log("Parsing");
    }

    return this.HasChildren();
  }
}

export class RelativeSelectorList extends SelectorList
{
  Parse()
  {
    while (this.IsParsing() && this.Match(RelativeSelectorSequence) && this.MatchComma())
    {
    }

    return this.HasChildren();
  }
}