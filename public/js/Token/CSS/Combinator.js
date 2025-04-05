import {CSS} from "/js/Token/CSS.js";
import {CommaSymbol, AddSymbol, TildeSymbol, GreaterThanSymbol} from "/js/Token/Text/Symbol.js";
// import {WhiteSpace, WhiteSpaceOptional} from "/js/Token/WhiteSpace.js";
// import {PaddedMultiLine, OptionalPaddedMultiLine} from "/js/Token/Comment/Multiline.js";
// import {MultiLineCommentSequence} from "/js/Token/CSS/Sequence/MultiLineCommentSequence.js";

export class Combinator extends CSS
{
  // static Parse(token)
  // {
  //   // if (this.Peek() !== "[") return false;
  // }

  // static Parse(token)
  // {
  //   if (token.Peek(0) !== ":") return false;
    
  //   switch (token.Peek(0))
  //   {
  //     case ":":
  //     {
  //       return false; // Can't match two in a row, that's an Element
  //     }
  //   }
  // }
}

export class ChildCombinator extends Combinator
{
  Parse()
  {
    return this.MultiLineCommentSequence()
        && this.Match(GreaterThanSymbol)
        && this.MultiLineCommentSequence();
  }
}

export class AdjacentSiblingCombinator extends Combinator
{
  Parse()
  {
    return this.MultiLineCommentSequence()
        && this.Match(AddSymbol)
        && this.MultiLineCommentSequence();
  }
}

export class GeneralSiblingCombinator extends Combinator
{
  Parse()
  {
    return this.MultiLineCommentSequence()
        && this.Match(TildeSymbol)
        && this.MultiLineCommentSequence();
  }
}

export class DescendantCombinator extends Combinator
{
  Parse()
  {
    return this.MultiLineCommentSequence() && this.GetLength() > 0;
  }
}

export class ImplicitCombinator extends Combinator
{
  Parse()
  {
    return this.IsParsing() && this.Peek() !== "," && !this.IsSpace(this.Peek());
  }
}