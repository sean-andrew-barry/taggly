import {Expression} from "/js/Parser/Token/Expression.js";

import * as Keywords from "/js/Parser/Token/CSS/Keyword.js";
import * as Symbols from "/js/Parser/Token/CSS/Symbol.js";
import * as Literals from "/js/Parser/Token/CSS/Literal.js";

export class URL extends Expression
{
  Parse(p)
  {
  }
}

export class Gradient extends Expression
{
  Parse(p)
  {
  }
}

export class Image extends Expression
{
  Parse(p)
  {
    return p.Match(URL) || p.Match(Gradient);
  }
}

// <bg-position>
export class BgPosition extends Expression
{
  Multi(p)
  {
    return p.Center()?.WSO().LeftOrRight()?.WSO().OptionalLengthPercentage()?.WSO()
        && p.Center()?.WSO().TopOrBottom()?.WSO().OptionalLengthPercentage();
  }

  Parse(p)
  {
    return p.Generic()
        || this.Multi(p);
        || p.HorizontalPositionGroup()?.VerticalPositionGroup();
  }
}

export class BgImage extends Expression
{
  Multi(p)
  {
    return p.Center()?.WSO().LeftOrRight()?.WSO().OptionalLengthPercentage()?.WSO()
        && p.Center()?.WSO().TopOrBottom()?.WSO().OptionalLengthPercentage();
  }

  Parse(p)
  {
    return p.Image() || p.Match(Keywords.None);
  }
}

// <box>: https://drafts.csswg.org/css-backgrounds/#typedef-box
export class Box extends Expression
{
  Parse(p)
  {
    return p.Match(Keywords.BorderBox)
        || p.Match(Keywords.PaddingBox)
        || p.Match(Keywords.ContentBox);
  }
}

// <attachment>: https://drafts.csswg.org/css-backgrounds/#typedef-attachment
export class Attachment extends Expression
{
  Parse(p)
  {
    return p.Match(Keywords.Scroll)
        || p.Match(Keywords.Fixed)
        || p.Match(Keywords.Local);
  }
}

export class NamedColor extends Expression
{
  MatchA(p)
  {
    return p.Read("aqua")
        || p.Read("aliceblue")
        || p.Read("antiquewhite")
        || p.Read("aquamarine")
        || p.Read("azure");
  }

  MatchB(p)
  {
    return p.Read("beige")
        || p.Read("bisque")
        || p.Read("blanchedalmond")
        || p.Read("blueviolet")
        || p.Read("brown")
        || p.Read("burlywood")
        || p.Read("black")
        || p.Read("blue");
  }

  MatchC(p)
  {
    return p.Read("cadetblue")
        || p.Read("chartreuse")
        || p.Read("chocolate")
        || p.Read("coral")
        || p.Read("cornflowerblue")
        || p.Read("cornsilk")
        || p.Read("crimson")
        || p.Read("currentColor")
        || p.Read("cyan");
  }

  MatchD(p)
  {
    return p.Read("darkblue")
        || p.Read("darkcyan")
        || p.Read("darkgoldenrod")
        || p.Read("darkgray")
        || p.Read("darkgreen")
        || p.Read("darkgrey")
        || p.Read("darkkhaki")
        || p.Read("darkmagenta")
        || p.Read("darkolivegreen")
        || p.Read("darkorange")
        || p.Read("darkorchid")
        || p.Read("darkred")
        || p.Read("darksalmon")
        || p.Read("darkseagreen")
        || p.Read("darkslateblue")
        || p.Read("darkslategray")
        || p.Read("darkslategrey")
        || p.Read("darkturquoise")
        || p.Read("darkviolet")
        || p.Read("deeppink")
        || p.Read("deepskyblue")
        || p.Read("dimgray")
        || p.Read("dimgrey")
        || p.Read("dodgerblue");
  }

  MatchE(p){ return; }

  MatchF(p)
  {
    return p.Read("firebrick")
        || p.Read("floralwhite")
        || p.Read("forestgreen")
        || p.Read("fuchsia");
  }

  MatchG(p)
  {
    return p.Read("gainsboro")
        || p.Read("ghostwhite")
        || p.Read("gold")
        || p.Read("goldenrod")
        || p.Read("gray")
        || p.Read("green")
        || p.Read("greenyellow")
        || p.Read("grey");
  }

  MatchH(p){ return p.Read("honeydew") || p.Read("hotpink"); }
  MatchI(p){ return p.Read("indianred") || p.Read("indigo") || p.Read("ivory"); }
  MatchJ(p){ return; }
  MatchK(p){ return p.Read("khaki"); }

  MatchL(p)
  {
    return p.Read("lavender")
        || p.Read("lavenderblush")
        || p.Read("lawngreen")
        || p.Read("lemonchiffon")
        || p.Read("lightblue")
        || p.Read("lightcoral")
        || p.Read("lightcyan")
        || p.Read("lightgoldenrodyellow")
        || p.Read("lightgray")
        || p.Read("lightgreen")
        || p.Read("lightgrey")
        || p.Read("lightpink")
        || p.Read("lightsalmon")
        || p.Read("lightseagreen")
        || p.Read("lightskyblue")
        || p.Read("lightslategray")
        || p.Read("lightslategrey")
        || p.Read("lightsteelblue")
        || p.Read("lightyellow")
        || p.Read("lime")
        || p.Read("limegreen")
        || p.Read("linen");
  }

  MatchM(p)
  {
    return p.Read("magenta")
        || p.Read("maroon")
        || p.Read("mediumaquamarine")
        || p.Read("mediumblue")
        || p.Read("mediumorchid")
        || p.Read("mediumpurple")
        || p.Read("mediumseagreen")
        || p.Read("mediumslateblue")
        || p.Read("mediumspringgreen")
        || p.Read("mediumturquoise")
        || p.Read("mediumvioletred")
        || p.Read("midnightblue")
        || p.Read("mintcream")
        || p.Read("mistyrose")
        || p.Read("moccasin");
  }

  MatchN(p){ return p.Read("navajowhite") || p.Read("navy"); }

  MatchO(p)
  {
    return p.Read("oldlace")
        || p.Read("olive")
        || p.Read("olivedrab")
        || p.Read("orange")
        || p.Read("orangered")
        || p.Read("orchid");
  }

  MatchP(p)
  {
    return p.Read("palegoldenrod")
        || p.Read("palegreen")
        || p.Read("paleturquoise")
        || p.Read("palevioletred")
        || p.Read("papayawhip")
        || p.Read("peachpuff")
        || p.Read("peru")
        || p.Read("pink")
        || p.Read("plum")
        || p.Read("powderblue")
        || p.Read("purple");
  }

  MatchQ(p){ return; }
  MatchR(p){ return p.Read("red") || p.Read("rosybrown") || p.Read("royalblue"); }

  MatchS(p)
  {
    return p.Read("saddlebrown")
        || p.Read("salmon")
        || p.Read("sandybrown")
        || p.Read("seagreen")
        || p.Read("seashell")
        || p.Read("sienna")
        || p.Read("silver")
        || p.Read("skyblue")
        || p.Read("slateblue")
        || p.Read("slategray")
        || p.Read("slategrey")
        || p.Read("snow")
        || p.Read("springgreen")
        || p.Read("steelblue");
  }

  MatchT(p)
  {
    return p.Read("tan")
        || p.Read("teal")
        || p.Read("thistle")
        || p.Read("tomato")
        || p.Read("transparent")
        || p.Read("turquoise");
  }

  MatchU(p){ return; }
  MatchV(p){ return p.Read("violet"); }
  MatchW(p){ return p.Read("wheat") || p.Read("white") || p.Read("whitesmoke"); }
  MatchX(p){ return; }
  MatchY(p){ return p.Read("yellow") || p.Read("yellowgreen"); }
  MatchZ(p){ return; }

  Parse(p)
  {
    switch (p.Peek())
    {
      case "a": return this.MatchA(p);
      case "b": return this.MatchB(p);
      case "c": return this.MatchC(p);
      case "d": return this.MatchD(p);
      case "e": return this.MatchE(p);
      case "f": return this.MatchF(p);
      case "g": return this.MatchG(p);
      case "h": return this.MatchH(p);
      case "i": return this.MatchI(p);
      case "j": return this.MatchJ(p);
      case "k": return this.MatchK(p);
      case "l": return this.MatchL(p);
      case "m": return this.MatchM(p);
      case "n": return this.MatchN(p);
      case "o": return this.MatchO(p);
      case "p": return this.MatchP(p);
      case "q": return this.MatchQ(p);
      case "r": return this.MatchR(p);
      case "s": return this.MatchS(p);
      case "t": return this.MatchT(p);
      case "u": return this.MatchU(p);
      case "v": return this.MatchV(p);
      case "w": return this.MatchW(p);
      case "x": return this.MatchX(p);
      case "y": return this.MatchY(p);
      case "z": return this.MatchZ(p);
    }
  }
}

export class HexColor extends Expression
{
  Parse(p)
  {
  }
}

export class ColorFunction extends Expression
{
  Parse(p)
  {
    return p.Match(Literals.RGBA)
        || p.Match(Literals.RGB)
        || p.Match(Literals.HSLA)
        || p.Match(Literals.HSL)
        || p.Match(Literals.HWB)
        || p.Match(Literals.LAB)
        || p.Match(Literals.LCH)
        || p.Match(Literals.Color)
        || p.Match(Literals.DeviceCMYK)
  }
}

// <color>: https://www.w3.org/TR/css-color-4/#typedef-color
export class Color extends Expression
{
  Parse(p)
  {
    return p.Match(Keywords.CurrentColor)
        || p.Match(Keywords.Transparent)
        || p.Match(NamedColor)
        || p.Match(ColorFunction)
        || p.Match(Literals.SystemColor);
  }
}

export class Generic extends Expression
{
  Parse(p)
  {
    return p.Match(Keywords.Inherit)?.End()
        || p.Match(Keywords.Initial)?.End()
        || p.Match(Keywords.Unset)?.End()
        ;
  }
}

export class RepeatStyle extends Expression
{
  Helper(p)
  {
    return p.Match(Keywords.Repeat)
        || p.Match(Keywords.Space)
        || p.Match(Keywords.Round)
        || p.Match(Keywords.NoRepeat);
  }

  Parse(p)
  {
    return p.Match(Keywords.RepeatX)
        || p.Match(Keywords.RepeatY)
        || p.Range(1, 2, () => this.Helper(p));
  }
}

export class BgSize extends Expression
{
  Helper(p)
  {
    return p.Match(Keywords.Auto)
        || p.Match(Expressions.LengthPercentage);
  }

  Parse(p)
  {
    return p.Match(Keywords.Cover)
        || p.Match(Keywords.Contain)
        || p.Range(1, 2, () => this.Helper(p));
  }
}
