import {Token} from "/js/Parser/Token.js";
import * as Keywords from "/js/Parser/Token/CSS/Keyword.js";
import * as Symbols from "/js/Parser/Token/CSS/Symbol.js";
import * as Literals from "/js/Parser/Token/CSS/Literal.js";

export class Style extends Token
{
  ParseTypeA(p)
  {
    return p.Match(Keywords.Azimuth);
  }

  Range(min, max, fn)
  {
    // If it fails before reaching `min` times, fail
    for (let i = 0; i < min; i++)
    {
      if (!fn.call(this, this))
      {
        return;
      }
    }

    // Allow it to continue up to `max`, but stop as soon as it fails
    for (let i = min; i < max; i++)
    {
      if (!fn.call(this, this))
      {
        break;
      }
    }

    return this;
  }

  // Same as a range, but it allows for whitespace and commas between each match
  // https://www.w3.org/TR/css-values-4/#mult-comma
  HashRange(min, max, fn)
  {
    return this.Range(min, max, () =>
    {
      return fn.call(this, this)?.WSO().Comma()?.WSO();
    });
  }

  Angle(){ return this.Match(Literals.Angle); }
  URL(){ return this.Match(Literals.URL); }
  SideOrCorner(){ return this.Either(this.LeftOrRight, this.TopOrBottom); }

  LinearGradient()
  {
    return this.Angle()
        || this
  }

  // https://www.w3.org/TR/css-images-3/#typedef-gradient
  Gradient()
  {
    return this.LinearGradient()
        || this.RepeatingLinearGradient()
        || this.RadialGradient()
        || this.RepeatingRadialGradient();
  }

  // https://www.w3.org/TR/css-images-3/#typedef-image
  Image(){ return this.URL() || this.Gradient(); }
  BgImage(){ return this.Image() || this.None(); }

  PositionGroup()
  {
    return this.Left()
        || this.Center()
        || this.Right()
        || this.Top()
        || this.Bottom()
        || this.LengthPercentage();
  }

  HorizontalPositionGroup()
  {
    return this.Left()
        || this.Center()
        || this.Right()
        || this.LengthPercentage();
  }

  VerticalPositionGroup()
  {
    return this.Top()
        || this.Center()
        || this.Bottom()
        || this.LengthPercentage();
  }

  LeftOrRight(){ return this.Left() || this.Right(); }
  TopOrBottom(){ return this.Top() || this.Bottom(); }
  OptionalLengthPercentage(){ return this.LengthPercentage() || this; }

  BgPosition(){ return this.Match(Expressions.BgPosition); }

  ParseTypeB(p)
  {
    return undefined
        || p.Match(Keywords.BackgroundAttachment)
        || p.Match(Keywords.BackgroundColor)?.WSO().MatchColor()
        || p.Match(Keywords.BackgroundImage)
        || p.Match(Keywords.BackgroundPosition)
        || p.Match(Keywords.BackgroundRepeat)
        || p.Match(Keywords.Background)
        || p.Match(Keywords.Border)
        || p.Match(Keywords.BorderCollapse)
        || p.Match(Keywords.BorderColor)
        || p.Match(Keywords.BorderSpacing)
        || p.Match(Keywords.BorderStyle)
        || p.Match(Keywords.BorderTop)
        || p.Match(Keywords.BorderRight)
        || p.Match(Keywords.BorderBottom)
        || p.Match(Keywords.BorderLeft)
        || p.Match(Keywords.BorderTopColor)
        || p.Match(Keywords.BorderRightColor)
        || p.Match(Keywords.BorderBottomColor)
        || p.Match(Keywords.BorderLeftColor)
        || p.Match(Keywords.BorderTopStyle)
        || p.Match(Keywords.BorderRightStyle)
        || p.Match(Keywords.BorderBottomStyle)
        || p.Match(Keywords.BorderLeftStyle)
        || p.Match(Keywords.BorderTopWidth)
        || p.Match(Keywords.BorderRightWidth)
        || p.Match(Keywords.BorderBottomWidth)
        || p.Match(Keywords.BorderLeftWidth)
        || p.Match(Keywords.BorderWidth)
        || p.Match(Keywords.Bottom)
  }

  ColorRange(){ return this.Range(1, 4, this.Color); }
  GenericOrColorRange(){ return this.Generic() || this.ColorRange(); }

  Keyword(text){ return this.Read(text)?.WSO(); }
  Style(text){ return this.Keyword(text)?.Match(Symbols.Colon)?.WSO(); }

  BackgroundColor(){ return this.Keyword("background-color") && this.GenericOrColorRange(); }
  BorderColor(){ return this.Keyword("border-color") && this.GenericOrColorRange(); }

  KeywordScroll(){ return this.Keyword("scroll"); }
  KeywordFixed(){ return this.Keyword("fixed"); }
  KeywordLocal(){ return this.Keyword("local"); }

  KeywordLeft(){ return this.Keyword("left"); }
  KeywordCenter(){ return this.Keyword("center"); }
  KeywordRight(){ return this.Keyword("right"); }
  KeywordTop(){ return this.Keyword("top"); }
  KeywordBottom(){ return this.Keyword("bottom"); }

  KeywordRepeatX(){ return this.Keyword("repeat-x"); }
  KeywordRepeatY(){ return this.Keyword("repeat-y"); }
  KeywordRepeat(){ return this.Keyword("repeat"); }
  KeywordSpace(){ return this.Keyword("space"); }
  KeywordRound(){ return this.Keyword("round"); }
  KeywordNoRepeat(){ return this.Keyword("no-repeat"); }

  RepeatStyleHashRangeHelper()
  {
    return this.KeywordRepeat()
        || this.KeywordSpace()
        || this.KeywordRound()
        || this.KeywordNoRepeat();
  }

  // https://drafts.csswg.org/css-backgrounds/#typedef-repeat-style
  RepeatStyle()
  {
    return this.KeywordRepeatX()
        || this.KeywordRepeatY()
        || this.Range(1, 2, this.RepeatStyleHashRangeHelper);
  }

  ParseTypeB(p)
  {
    return undefined
        || p.Match(Keywords.BackgroundAttachment)
        || p.Style("background-color")?.GenericOrColorRange()
        || p.Style("background-image")?.Repeat(Literals.URL)
        || p.Style("background-repeat")?.RepeatStyle()
        || p.Style("background-attachment")?.Attatchment()
        || p.Match(Keywords.BackgroundImage)
        || p.Match(Keywords.BackgroundPosition)
        || p.Match(Keywords.BackgroundRepeat)
        || p.Match(Keywords.Background)
        || p.Match(Keywords.Border)
        || p.Match(Keywords.BorderCollapse)
        || p.Match(Keywords.BorderColor)
        || p.Match(Keywords.BorderSpacing)
        || p.Match(Keywords.BorderStyle)
        || p.Match(Keywords.BorderTop)
        || p.Match(Keywords.BorderRight)
        || p.Match(Keywords.BorderBottom)
        || p.Match(Keywords.BorderLeft)
        || p.Match(Keywords.BorderTopColor)
        || p.Match(Keywords.BorderRightColor)
        || p.Match(Keywords.BorderBottomColor)
        || p.Match(Keywords.BorderLeftColor)
        || p.Match(Keywords.BorderTopStyle)
        || p.Match(Keywords.BorderRightStyle)
        || p.Match(Keywords.BorderBottomStyle)
        || p.Match(Keywords.BorderLeftStyle)
        || p.Match(Keywords.BorderTopWidth)
        || p.Match(Keywords.BorderRightWidth)
        || p.Match(Keywords.BorderBottomWidth)
        || p.Match(Keywords.BorderLeftWidth)
        || p.Match(Keywords.BorderWidth)
        || p.Match(Keywords.Bottom)
  }

  ParseType(p)
  {
    switch (p.Peek())
    {
      case "a": this.ParseTypeA(p);
      case "b": this.ParseTypeB(p);
      default:
      {
      }
    }
  }

  Parse(p)
  {
    if (p.Match(Literals.Reference)?.WSO().Match(Symbols.Colon)?.WSO())
    {

    }
    if (!p.Match(Literals.Reference)) return false;

    p.WSO();

    if (!p.Match(SymbolsColon)) return false;

    p.Match(WhiteSpace);

    while (!p.Match(SemiColon))
    {
      if (!this.ParseKeyword(p) && !this.ParseValue(p) && !p.Parse())
      {
        return false;
      }
    }

    return true;
  }
}
