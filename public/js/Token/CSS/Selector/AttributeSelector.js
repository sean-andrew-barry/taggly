import {Selector} from "/js/Token/CSS/Selector.js";
import {Identifier} from "/js/Token/Text/Identifier.js";
import {StringLiteral} from "/js/Token/Literal/StringLiteral.js";
import {WhiteSpace} from "/js/Token/Text/WhiteSpace.js";
import {AssignSymbol, TilAssignSymbol, BarAssignSymbol, XorAssignSymbol, DolAssignSymbol, MulAssignSymbol, OpenBracketSymbol, CloseBracketSymbol, BarSymbol} from "/js/Token/Text/Symbol.js";
import {IKeyword, SKeyword} from "/js/Token/CSS/Keyword/Keyword.js";

// Matches [attr], [attr=value], [attr^=value], [attr$=value s], [attr*="value" i]
export class AttributeSelector extends Selector
{
  MatchOperator()
  {
    return this.Match(AssignSymbol)
        || this.Match(XorAssignSymbol)
        || this.Match(DolAssignSymbol)
        || this.Match(MulAssignSymbol)
        || this.Match(TilAssignSymbol)
        || this.Match(BarAssignSymbol);
  }

  MatchCloseBracket()
  {
    return this.Match(CloseBracketSymbol) // Test if we can end right away
        || this.MatchOperator() // Match any operator
        && this.Optional(WhiteSpace)
        && (this.Match(Identifier) || this.Match(StringLiteral)) // Required since we matched an operator
        && this.Optional(WhiteSpace)
        && (this.Match(IKeyword) || this.Match(SKeyword) || true) // Optional, but only match one (I think)
        && this.Optional(WhiteSpace)
        && this.Match(CloseBracketSymbol);
  }

  Parse()
  {
    try
    {
      return this.Match(OpenBracketSymbol)
          && this.Optional(WhiteSpace)
          && this.Match(Identifier)
          && (this.Match(BarSymbol) && this.Optional(WhiteSpace) && this.Match(Identifier) || true)
          && this.Optional(WhiteSpace)
          && this.MatchCloseBracket();
    }
    catch (error)
    {
      console.error("Caught", error);
    }
  }
}