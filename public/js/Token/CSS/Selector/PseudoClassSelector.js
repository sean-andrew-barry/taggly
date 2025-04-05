import {Selector} from "/js/Token/CSS/Selector.js";
import * as K from "/js/Token/CSS/Keyword/Keyword.js";
import {ColonSymbol, OpenParenthesisSymbol, CloseParenthesisSymbol} from "/js/Token/Text/Symbol.js";
import {WhiteSpace} from "/js/Token/Text/WhiteSpace.js";
import {Identifier} from "/js/Token/Text/Identifier.js";
import {SelectorList, RelativeSelectorList} from "/js/Token/CSS/SelectorList.js";
import {NthExpression} from "/js/Token/CSS/Expression/NthExpression.js";
import {AnPlusBExpression} from "/js/Token/CSS/Expression/AnPlusBExpression.js";
// import {FirstLetterPseudoElementSelector} from "/js/Token/CSS/Selector/PseudoElementSelector.js";

export class PseudoClassSelector extends Selector
{
  static Parse(token)
  {
    if (token.Peek(0) !== ":") return false;
    
    switch (token.Peek(1))
    {
      case ":":
      {
        return false; // Can't match two in a row, that's an Element
      }
      case "a": 
      case "A":
      {
        return token.Match(ActivePseudoClassSelector)
            || token.Match(AnyLinkPseudoClassSelector)
            || token.Match(AutofillPseudoClassSelector);
      }
      case "b": 
      case "B":
      {
        return token.Match(BlankPseudoClassSelector);
      }
      case "c":
      case "C":
      {
        return token.Match(CheckedPseudoClassSelector)
            || token.Match(CurrentPseudoClassSelector);

      }
      case "d":
      case "D":
      {
        return token.Match(DefaultPseudoClassSelector)
            || token.Match(DefinedPseudoClassSelector)
            || token.Match(DirPseudoClassSelector)
            || token.Match(DisabledPseudoClassSelector);
      }
      case "e":
      case "E":
      {
        return token.Match(EmptyPseudoClassSelector)
            || token.Match(EnabledPseudoClassSelector);
      }
      case "f":
      case "F":
      {
        // // This is an Element and not a Class and doesn't belong here but otherwise if someone uses the old single colon syntax, it'll fucking break cause Classes have to be parsed before Elements!
        // if (token.Match(FirstLetterPseudoElementSelector))
        // {
        //   return true;
        // }
        
        return token.Match(FirstChildPseudoClassSelector)
            || token.Match(FirstOfTypePseudoClassSelector)
            || token.Match(FirstPseudoClassSelector)
            || token.Match(FullscreenPseudoClassSelector)
            || token.Match(FuturePseudoClassSelector)
            || token.Match(FocusVisiblePseudoClassSelector)
            || token.Match(FocusWithinPseudoClassSelector)
            || token.Match(FocusPseudoClassSelector);
      }
      case "h":
      case "H":
      {
        return token.Match(HasPseudoClassSelector)
            || token.Match(HostContextPseudoClassSelector)
            || token.Match(HostFunctionPseudoClassSelector)
            || token.Match(HostPseudoClassSelector)
            || token.Match(HoverPseudoClassSelector);
      }
      case "i":
      case "I":
      {
        return token.Match(IndeterminatePseudoClassSelector)
            || token.Match(InRangePseudoClassSelector)
            || token.Match(InvalidPseudoClassSelector)
            || token.Match(IsPseudoClassSelector);
      }
      case "l":
      case "L":
      {
        return token.Match(LangPseudoClassSelector)
            || token.Match(LastChildPseudoClassSelector)
            || token.Match(LastOfTypePseudoClassSelector)
            || token.Match(LeftPseudoClassSelector)
            || token.Match(LinkPseudoClassSelector)
            || token.Match(LocalLinkPseudoClassSelector);
      }
      case "m":
      case "M":
      {
        return token.Match(ModalPseudoClassSelector);
      }
      case "n":
      case "N":
      {
        return token.Match(NotPseudoClassSelector)
            || token.Match(NthChildPseudoClassSelector)
            || token.Match(NthColPseudoClassSelector)
            || token.Match(NthLastChildPseudoClassSelector)
            || token.Match(NthLastColPseudoClassSelector)
            || token.Match(NthLastOfTypePseudoClassSelector)
            || token.Match(NthOfTypePseudoClassSelector);
      }
      case "o":
      case "O":
      {
        return token.Match(OnlyChildPseudoClassSelector)
            || token.Match(OnlyOfTypePseudoClassSelector)
            || token.Match(OptionalPseudoClassSelector)
            || token.Match(OutOfRangePseudoClassSelector);
      }
      case "p":
      case "P":
      {
        return token.Match(PastPseudoClassSelector)
            || token.Match(PictureInPicturePseudoClassSelector)
            || token.Match(PlaceholderShownPseudoClassSelector)
            || token.Match(PausedPseudoClassSelector)
            || token.Match(PlayingPseudoClassSelector);
      }
      case "r":
      case "R":
      {
        return token.Match(ReadOnlyPseudoClassSelector)
            || token.Match(ReadWritePseudoClassSelector)
            || token.Match(RequiredPseudoClassSelector)
            || token.Match(RightPseudoClassSelector)
            || token.Match(RootPseudoClassSelector);
      }
      case "s":
      case "S":
      {
        return token.Match(ScopePseudoClassSelector)
            || token.Match(StatePseudoClassSelector);
      }
      case "t":
      case "T":
      {
        return token.Match(TargetWithinPseudoClassSelector)
            || token.Match(TargetPseudoClassSelector);
      }
      case "u":
      case "U":
      {
        return token.Match(UserInvalidPseudoClassSelector);
      }
      case "v":
      case "V":
      {
        return token.Match(ValidPseudoClassSelector)
            || token.Match(VisitedPseudoClassSelector);
      }
      case "w":
      case "W":
      {
        return token.Match(WherePseudoClassSelector);
      }
      default:
      {
        return false;
      }
    }
  }

  Parse(keyword)
  {
    return this.Match(ColonSymbol) && this.Match(keyword);
  }

  MatchFunctional(ctor)
  {

  }
}

export class ActivePseudoClassSelector extends PseudoClassSelector { Parse(){ return super.Parse(K.ActiveKeyword); } }
export class AnyLinkPseudoClassSelector extends PseudoClassSelector { Parse(){ return super.Parse(K.AnyLinkKeyword); } }
export class AutofillPseudoClassSelector extends PseudoClassSelector { Parse(){ return super.Parse(K.AutofillKeyword); } }
export class BlankPseudoClassSelector extends PseudoClassSelector { Parse(){ return super.Parse(K.BlankKeyword); } }
export class CheckedPseudoClassSelector extends PseudoClassSelector { Parse(){ return super.Parse(K.CheckedKeyword); } }
export class CurrentPseudoClassSelector extends PseudoClassSelector { Parse(){ return super.Parse(K.CurrentKeyword); } }
export class DefaultPseudoClassSelector extends PseudoClassSelector { Parse(){ return super.Parse(K.DefaultKeyword); } }
export class DefinedPseudoClassSelector extends PseudoClassSelector { Parse(){ return super.Parse(K.DefinedKeyword); } }

export class DirPseudoClassSelector extends PseudoClassSelector
{
  Parse()
  {
    return this.Match(ColonSymbol)
        && this.Match(K.DirKeyword)
        && this.Match(OpenParenthesisSymbol)
        && this.Optional(WhiteSpace)
        && (this.Match(K.LTRKeyword) || this.Match(K.RTLKeyword) || this.Match(Identifier))
        && this.Optional(WhiteSpace)
        && this.Match(CloseParenthesisSymbol);
  }
}

export class DisabledPseudoClassSelector extends PseudoClassSelector { Parse(){ return super.Parse(K.DisabledKeyword); } }
export class EmptyPseudoClassSelector extends PseudoClassSelector { Parse(){ return super.Parse(K.EmptyKeyword); } }
export class EnabledPseudoClassSelector extends PseudoClassSelector { Parse(){ return super.Parse(K.EnabledKeyword); } }
export class FirstPseudoClassSelector extends PseudoClassSelector { Parse(){ return super.Parse(K.FirstKeyword); } }
export class FirstChildPseudoClassSelector extends PseudoClassSelector { Parse(){ return super.Parse(K.FirstChildKeyword); } }
export class FirstOfTypePseudoClassSelector extends PseudoClassSelector { Parse(){ return super.Parse(K.FirstOfTypeKeyword); } }
export class FullscreenPseudoClassSelector extends PseudoClassSelector { Parse(){ return super.Parse(K.FullscreenKeyword); } }
export class FuturePseudoClassSelector extends PseudoClassSelector { Parse(){ return super.Parse(K.FutureKeyword); } }
export class FocusPseudoClassSelector extends PseudoClassSelector { Parse(){ return super.Parse(K.FocusKeyword); } }
export class FocusVisiblePseudoClassSelector extends PseudoClassSelector { Parse(){ return super.Parse(K.FocusVisibleKeyword); } }
export class FocusWithinPseudoClassSelector extends PseudoClassSelector { Parse(){ return super.Parse(K.FocusWithinKeyword); } }

export class HasPseudoClassSelector extends PseudoClassSelector
{
  Parse()
  {
    return this.Match(ColonSymbol)
        && this.Match(K.HasKeyword)
        && this.Match(OpenParenthesisSymbol)
        && this.Optional(WhiteSpace)
        && this.Match(RelativeSelectorList)
        && this.Optional(WhiteSpace)
        && this.Match(CloseParenthesisSymbol);
  }
}

export class HostPseudoClassSelector extends PseudoClassSelector { Parse(){ return super.Parse(K.HostKeyword); } }
export class HostFunctionPseudoClassSelector extends PseudoClassSelector { Parse(){ return super.Parse(K.HostKeyword); } }
export class HostContextPseudoClassSelector extends PseudoClassSelector { Parse(){ return super.Parse(K.HostContextKeyword); } }
export class HoverPseudoClassSelector extends PseudoClassSelector { Parse(){ return super.Parse(K.HoverKeyword); } }
export class IndeterminatePseudoClassSelector extends PseudoClassSelector { Parse(){ return super.Parse(K.IndeterminateKeyword); } }
export class InRangePseudoClassSelector extends PseudoClassSelector { Parse(){ return super.Parse(K.InRangeKeyword); } }
export class InvalidPseudoClassSelector extends PseudoClassSelector { Parse(){ return super.Parse(K.InvalidKeyword); } }

export class IsPseudoClassSelector extends PseudoClassSelector
{
  Parse()
  {
    return super.Parse(K.IsKeyword)
        && this.Match(OpenParenthesisSymbol)
        && this.Optional(WhiteSpace)
        && this.Match(SelectorList) // Technically this should be a ForgivingSelectorList
        && this.Optional(WhiteSpace)
        && this.Match(CloseParenthesisSymbol);
  }
}

export class LangPseudoClassSelector extends PseudoClassSelector
{
  Parse()
  {
    return this.Match(ColonSymbol)
        && this.Match(K.LangKeyword)
        && this.Match(OpenParenthesisSymbol)
        && this.Optional(WhiteSpace)
        && this.Match(Identifier)
        && this.Optional(WhiteSpace)
        && this.Match(CloseParenthesisSymbol);
  }
}

export class LastChildPseudoClassSelector extends PseudoClassSelector { Parse(){ return super.Parse(K.LastChildKeyword); } }
export class LastOfTypePseudoClassSelector extends PseudoClassSelector { Parse(){ return super.Parse(K.LastOfTypeKeyword); } }
export class LeftPseudoClassSelector extends PseudoClassSelector { Parse(){ return super.Parse(K.LeftKeyword); } }
export class LinkPseudoClassSelector extends PseudoClassSelector { Parse(){ return super.Parse(K.LinkKeyword); } }
export class LocalLinkPseudoClassSelector extends PseudoClassSelector { Parse(){ return super.Parse(K.LocalLinkKeyword); } }
export class ModalPseudoClassSelector extends PseudoClassSelector { Parse(){ return super.Parse(K.ModalKeyword); } }

export class NotPseudoClassSelector extends PseudoClassSelector
{
  Parse()
  {
    return this.Match(ColonSymbol)
        && this.Match(K.NotKeyword)
        && this.Match(OpenParenthesisSymbol)
        && this.Optional(WhiteSpace)
        && this.Match(SelectorList)
        && this.Optional(WhiteSpace)
        && this.Match(CloseParenthesisSymbol);
  }
}

export class NthPseudoClassSelectorBase extends PseudoClassSelector
{
  Keyword(){ throw new Error(`Keyword must be overridden with a keyword token type`); }

  MatchStart()
  {
    return this.Match(ColonSymbol)
        && this.Match(this.Keyword())
        && this.Match(OpenParenthesisSymbol)
        && this.Optional(WhiteSpace)
        && this.Match(NthExpression)
        && this.Optional(WhiteSpace);
  }

  Parse()
  {
    if (!this.MatchStart()) return false;

    // It can be done after the NthExpression, so check for that
    if (this.Match(CloseParenthesisSymbol)) return true;

    return this.Match(K.OfKeyword)
        && this.Optional(WhiteSpace)
        && this.Match(SelectorList)
        && this.Optional(WhiteSpace)
        && this.Match(CloseParenthesisSymbol);
  }
}

export class NthChildPseudoClassSelector extends NthPseudoClassSelectorBase
{
  Keyword(){ return K.NthChildKeyword; }
}

export class NthOfTypePseudoClassSelectorBase extends PseudoClassSelector
{
  Keyword(){ throw new Error(`Keyword must be overridden with a keyword token type`); }

  Parse()
  {
    return this.Match(ColonSymbol)
        && this.Match(this.Keyword())
        && this.Match(OpenParenthesisSymbol)
        && this.Optional(WhiteSpace)
        && (this.Match(AnPlusBExpression) || this.Match(K.EvenKeyword) || this.Match(K.OddKeyword))
        && this.Optional(WhiteSpace)
        && this.Match(CloseParenthesisSymbol);
  }
}

export class NthColPseudoClassSelector extends PseudoClassSelector { Parse(){ return super.Parse(K.NthColKeyword); } }
export class NthLastChildPseudoClassSelector extends NthPseudoClassSelectorBase { Keyword(){ return K.NthLastChildKeyword; } }
export class NthLastColPseudoClassSelector extends PseudoClassSelector { Parse(){ return super.Parse(K.NthLastColKeyword); } }
export class NthLastOfTypePseudoClassSelector extends NthOfTypePseudoClassSelectorBase { Keyword(){ return K.NthLastOfTypeKeyword; } }
export class NthOfTypePseudoClassSelector extends NthOfTypePseudoClassSelectorBase { Keyword(){ return K.NthOfTypeKeyword; } }
export class OnlyChildPseudoClassSelector extends PseudoClassSelector { Parse(){ return super.Parse(K.OnlyChildKeyword); } }
export class OnlyOfTypePseudoClassSelector extends PseudoClassSelector { Parse(){ return super.Parse(K.OnlyOfTypeKeyword); } }
export class OptionalPseudoClassSelector extends PseudoClassSelector { Parse(){ return super.Parse(K.OptionalKeyword); } }
export class OutOfRangePseudoClassSelector extends PseudoClassSelector { Parse(){ return super.Parse(K.OutOfRangeKeyword); } }
export class PastPseudoClassSelector extends PseudoClassSelector { Parse(){ return super.Parse(K.PastKeyword); } }
export class PictureInPicturePseudoClassSelector extends PseudoClassSelector { Parse(){ return super.Parse(K.PictureInPictureKeyword); } }
export class PlaceholderShownPseudoClassSelector extends PseudoClassSelector { Parse(){ return super.Parse(K.PlaceholderShownKeyword); } }
export class PausedPseudoClassSelector extends PseudoClassSelector { Parse(){ return super.Parse(K.PausedKeyword); } }
export class PlayingPseudoClassSelector extends PseudoClassSelector { Parse(){ return super.Parse(K.PlayingKeyword); } }
export class ReadOnlyPseudoClassSelector extends PseudoClassSelector { Parse(){ return super.Parse(K.ReadOnlyKeyword); } }
export class ReadWritePseudoClassSelector extends PseudoClassSelector { Parse(){ return super.Parse(K.ReadWriteKeyword); } }
export class RequiredPseudoClassSelector extends PseudoClassSelector { Parse(){ return super.Parse(K.RequiredKeyword); } }
export class RightPseudoClassSelector extends PseudoClassSelector { Parse(){ return super.Parse(K.RightKeyword); } }
export class RootPseudoClassSelector extends PseudoClassSelector { Parse(){ return super.Parse(K.RootKeyword); } }
export class ScopePseudoClassSelector extends PseudoClassSelector { Parse(){ return super.Parse(K.ScopeKeyword); } }
export class StatePseudoClassSelector extends PseudoClassSelector { Parse(){ return super.Parse(K.StateKeyword); } }
export class TargetPseudoClassSelector extends PseudoClassSelector { Parse(){ return super.Parse(K.TargetKeyword); } }
export class TargetWithinPseudoClassSelector extends PseudoClassSelector { Parse(){ return super.Parse(K.TargetWithinKeyword); } }
export class UserInvalidPseudoClassSelector extends PseudoClassSelector { Parse(){ return super.Parse(K.UserInvalidKeyword); } }
export class ValidPseudoClassSelector extends PseudoClassSelector { Parse(){ return super.Parse(K.ValidKeyword); } }
export class VisitedPseudoClassSelector extends PseudoClassSelector { Parse(){ return super.Parse(K.VisitedKeyword); } }

export class WherePseudoClassSelector extends PseudoClassSelector
{
  Parse()
  {
    return this.Match(ColonSymbol)
        && this.Match(K.WhereKeyword)
        && this.Match(OpenParenthesisSymbol)
        && this.Optional(WhiteSpace)
        && this.Match(SelectorList) // TODO: Should be a ForgivingSelectorList
        && this.Optional(WhiteSpace)
        && this.Match(CloseParenthesisSymbol)
  }
}