import {Selector} from "/js/Token/CSS/Selector.js";
import * as K from "/js/Token/CSS/Keyword/Keyword.js";
import {DoubleColonSymbol, ColonSymbol, OpenParenthesisSymbol, CloseParenthesisSymbol} from "/js/Token/Text/Symbol.js";
import {WhiteSpace} from "/js/Token/Text/WhiteSpace.js";
import {Identifier} from "/js/Token/Text/Identifier.js";
import {CompoundSelector} from "/js/Token/CSS/Selector/CompoundSelector.js";

export class PseudoElementSelector extends Selector
{
  static Parse(token)
  {
    if (token.Peek(0) !== ":") return false;

    if (token.Peek(1) === ":")
    {
      switch (token.Peek(2))
      {
        case "a":
        case "A":
        {
          return token.Match(AfterPseudoElementSelector);
        }
        case "b":
        case "B":
        {
          return token.Match(BackdropPseudoElementSelector)
              || token.Match(BeforePseudoElementSelector);
        }
        case "c":
        case "C":
        {
          return token.Match(CueRegionPseudoElementSelector)
              || token.Match(CuePseudoElementSelector);
        }
        case "f":
        case "F":
        {
          return token.Match(FirstLetterPseudoElementSelector)
              || token.Match(FirstLinePseudoElementSelector)
              || token.Match(FileSelectorButtonPseudoElementSelector);
        }
        case "g":
        case "G":
        {
          return token.Match(GrammarErrorPseudoElementSelector);
        }
        case "h":
        case "H":
        {
          return token.Match(HighlightPseudoElementSelector);
        }
        case "m":
        case "M":
        {
          return token.Match(MarkerPseudoElementSelector);
        }
        case "p":
        case "P":
        {
          return token.Match(PartPseudoElementSelector)
              || token.Match(PlaceholderPseudoElementSelector);
        }
        case "s":
        case "S":
        {
          return token.Match(SelectionPseudoElementSelector)
              || token.Match(SlottedPseudoElementSelector)
              || token.Match(SpellingErrorPseudoElementSelector);
        }
        case "t":
        case "T":
        {
          return token.Match(TargetTextPseudoElementSelector);
        }
      }
    }
    // It may be one of the legacy versions
    else
    {
      return token.Match(AfterPseudoElementSelector)
          || token.Match(BeforePseudoElementSelector)
          || token.Match(FirstLetterPseudoElementSelector)
          || token.Match(FirstLinePseudoElementSelector);
    }

    return false;
  }

  Parse(keyword)
  {
    return this.Match(DoubleColonSymbol) && this.Match(keyword);
  }  

  ParseLegacy(keyword)
  {
    return (this.Match(DoubleColonSymbol) || this.Match(ColonSymbol)) && this.Match(keyword);
  }
}

export class AfterPseudoElementSelector extends PseudoElementSelector
{
  Parse(){ return this.ParseLegacy(K.AfterKeyword); }
}

export class BackdropPseudoElementSelector extends PseudoElementSelector
{
  Parse(){ return super.Parse(K.BackdropKeyword); }
}

export class BeforePseudoElementSelector extends PseudoElementSelector
{
  Parse(){ return (this.Match(DoubleColonSymbol) || this.Match(ColonSymbol)) && this.Match(K.BeforeKeyword); }
}

export class CuePseudoElementSelector extends PseudoElementSelector
{
  Parse(){ return super.Parse(K.CueKeyword); }
}

export class CueRegionPseudoElementSelector extends PseudoElementSelector
{
  Parse(){ return super.Parse(K.CueRegionKeyword); }
}

export class FirstLetterPseudoElementSelector extends PseudoElementSelector
{
  Parse(){ return (this.Match(DoubleColonSymbol) || this.Match(ColonSymbol)) && this.Match(K.FirstLetterKeyword); }
}

export class FirstLinePseudoElementSelector extends PseudoElementSelector
{
  Parse()
  {
    return (this.Match(DoubleColonSymbol) || this.Match(ColonSymbol))
        && this.Match(K.FirstLineKeyword);
  }
}

export class FileSelectorButtonPseudoElementSelector extends PseudoElementSelector
{
  Parse(){ return super.Parse(K.FileSelectorButtonKeyword); }
}

export class GrammarErrorPseudoElementSelector extends PseudoElementSelector
{
  Parse(){ return super.Parse(K.GrammarErrorKeyword); }
}

export class HighlightPseudoElementSelector extends PseudoElementSelector
{
  Parse()
  {
    return this.Match(DoubleColonSymbol)
        && this.Match(K.HighlightKeyword)
        && this.Match(OpenParenthesisSymbol)
        && this.Optional(WhiteSpace)
        && this.Match(Identifier)  // custom-highlight-name
        && this.Optional(WhiteSpace)
        && this.Match(CloseParenthesisSymbol);
  }
}

export class MarkerPseudoElementSelector extends PseudoElementSelector
{
  Parse(){ return super.Parse(K.MarkerKeyword); }
}

export class PartPseudoElementSelector extends PseudoElementSelector
{
  MatchIdentifiers()
  {
    let matched = false;
    
    // Match the first identifier; this one is mandatory.
    if (this.Match(Identifier))
    {
      matched = true;

      // Loop for additional identifiers.
      while (this.IsParsing())
      {
        if (this.Match(WhiteSpace) && this.Match(Identifier))
        {
          matched = true;
        }
        else
        {
          break;
        }
      }
    }
    
    return matched;
  }

  Parse()
  {
    return this.Match(DoubleColonSymbol)
        && this.Match(K.PartKeyword)
        && this.Match(OpenParenthesisSymbol)
        && this.Optional(WhiteSpace)
        && this.MatchIdentifiers()
        && this.Optional(WhiteSpace)
        && this.Match(CloseParenthesisSymbol)
  }
}

export class PlaceholderPseudoElementSelector extends PseudoElementSelector
{
  Parse(){ return super.Parse(K.PlaceholderKeyword); }
}

export class SelectionPseudoElementSelector extends PseudoElementSelector
{
  Parse(){ return super.Parse(K.SelectionKeyword); }
}

export class SlottedPseudoElementSelector extends PseudoElementSelector
{
  Parse()
  {
    return this.Match(DoubleColonSymbol)
        && this.Match(K.SlottedKeyword)
        && this.Match(OpenParenthesisSymbol)
        && this.Allow(WhiteSpace)
        && this.Match(CompoundSelector)
        && this.Allow(WhiteSpace)
        && this.Force(CloseParenthesisSymbol, "Expected to find a closing parenthesis");
  }
}

export class SpellingErrorPseudoElementSelector extends PseudoElementSelector
{
  Parse(){ return super.Parse(K.SpellingErrorKeyword); }
}

export class TargetTextPseudoElementSelector extends PseudoElementSelector
{
  Parse(){ return super.Parse(K.TargetTextKeyword); }
}

// function Example()
// {
//   return this.A()
//       && this.B()
//       || this.C()
//       && this.D()
//       || this.E();
// }

// function Resolved()
// {
//   return ((this.A() && this.B()) || (this.C() && this.D())) || this.E();
// }