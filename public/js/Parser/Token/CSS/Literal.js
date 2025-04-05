import {Literal} from "/js/Parser/Token/Literal.js";
import * as Keywords from "/js/Parser/Token/CSS/Keyword.js";
import * as Symbols from "/js/Parser/Token/CSS/Symbol.js";

export class Integer extends Literal
{
  Parse(p)
  {
    const c = p.Next();
    if (p !== "-" && p !== "+" && !p.IsDigit(c)) return;

    const digits = [c];
    while (p.IsParsing())
    {
      const c = p.Current();
      if (!p.IsDigit(c)) break;

      digits.push(c);
      p.Next();
    }

    const value = global.Number(digits.join(""));
    if (global.Number.isNaN(value)) return;

    p.Save(value);

    return p;
  }
}

export class Number extends Literal
{
  Parse(p)
  {
    const c = p.Next();
    if (p !== "-" && p !== "+" && !p.IsDigit(c)) return;

    const digits = [c];
    while (p.IsParsing())
    {
      const c = p.Current();
      if (c !== "." && !p.IsDigit(c)) break;

      digits.push(c);
      p.Next();
    }

    const value = global.Number(digits.join(""));
    if (global.Number.isNaN(value)) return;

    p.Save(value);
    this.value = value;

    return p;
  }
}

export class Length extends Literal
{
  MatchRelativeUnit()
  {
    return p.Match(Keywords.EM) // Font size
        || p.Match(Keywords.EX) // Font size X
        || p.Match(Keywords.Cap)
        || p.Match(Keywords.CH)
        || p.Match(Keywords.IC)
        || p.Match(Keywords.Rem)
        || p.Match(Keywords.LH)
        || p.Match(Keywords.RLH)
        || p.Match(Keywords.VW)
        || p.Match(Keywords.VH)
        || p.Match(Keywords.VI)
        || p.Match(Keywords.VB)
        || p.Match(Keywords.VMin)
        || p.Match(Keywords.VMax);
  }

  MatchAbsoluteUnit()
  {
    return p.Match(Keywords.CM) // Centimeters
        || p.Match(Keywords.MM) // Millimeters
        || p.Match(Keywords.Q) // Quarter Millimeters
        || p.Match(Keywords.IN) // Inches
        || p.Match(Keywords.PC) // Picas
        || p.Match(Keywords.PT) // Points
        || p.Match(Keywords.PX); // Pixels
  }

  Parse(p)
  {
    if (p.Parse(Number))
    {
      if (this.MatchRelativeUnit())
      {
        this.absolute = false;
        return p;
      }
      else if (this.MatchAbsoluteUnit())
      {
        this.absolute = true;
        return p;
      }
      // If a length is a 0, then the unit is optional, so we still match
      else if (this.value === 0)
      {
        return p;
      }
    }
  }
}

export class Percentage extends Literal
{
  Parse(p)
  {
    return p.Parse(Number) && p.Match(Symbols.Percent);
  }
}

export class Angle extends Literal
{
  Parse(p)
  {
    if (p.Parse(Number))
    {
      return p.Match(Keywords.Deg)
          || p.Match(Keywords.Grad)
          || p.Match(Keywords.Rad);
    }
  }
}

export class Frequency extends Literal
{
  Parse(p)
  {
    return p.Parse(Number) && (p.Match(Keywords.Hertz) || p.Match(Keywords.KiloHertz));
  }
}

export class Time extends Literal
{
  Parse(p)
  {
    return p.Parse(Number) && (p.Match(Keywords.S) || p.Match(Keywords.MS));
  }
}

export class Resolution extends Literal
{
  MatchUnit()
  {
    return p.Match(Keywords.DPI)
        || p.Match(Keywords.DPCM)
        || p.Match(Keywords.DPPX)
        || p.Match(Keywords.X);
  }

  Parse(p)
  {
    return p.Parse(Number) && this.MatchUnit();
  }
}

export class String extends Literal
{
  Parse(p)
  {
    let type;
    if      (p.Match(Symbols.SingleQuote)) type = Symbols.SingleQuote;
    else if (p.Match(Symbols.DoubleQuote)) type = Symbols.DoubleQuote;
    else return;

    let text = "";
    while (!p.Match(type))
    {
      if (p.IsDone()) return;

      text += p.Take();
    }

    this.Add(text);

    return p;
  }
}

export class Reference extends Literal
{
  Parse(p)
  {
    const c = p.Next();
    if ((c !== "_") && (c !== "-") && !p.IsAlpha(c)) return;

    let string = c;
    while (p.IsParsing())
    {
      const c = p.Current();
      if (c !== "_" && c !== "-" && !p.IsAlNum(c)) break;

      string += c;
      p.Next();
    }

    this.Add(string);
    this.name = string;

    return p;
  }
}

export class ID extends Literal
{
  Parse(p)
  {
    return p.Match(Symbols.Hash) && p.Match(Reference);
  }
}

export class Class extends Literal
{
  Parse(p)
  {
    return p.Match(Symbols.Dot) && p.Match(Reference);
  }
}

export class Function extends Literal
{
  ParseReference(p)
  {
    return p.Match(Reference);
  }

  ParseParameters(p)
  {
    return p;
  }

  Parse(p)
  {
    if (this.ParseReference()?.WSO().Match(Symbols.OpenParenthesis)?.WSO())
    {
      return this.ParseParameters()?.WSO().Match(Symbols.OpenParenthesis);
    }
  }
}

export class URL extends Function
{
  ParseReference(p){ return p.Match(Keywords.URL); }
  ParseParameters(p){ return p.Match(String); }
}

export class Math extends Function
{
  ParseValue(p)
  {
    return p.Match(Length)
        || p.Match(Percentage)
        || p.Match(Frequency)
        || p.Match(Angle)
        || p.Match(Time)
        || p.Match(Number)
        || p.Match(Integer)
        ;
  }

  ParseCSN(p){ return this.ParseValue()?.WSO().Match(Symbols.Comma)?.WSO(); }
}

export class Min extends Math
{
  ParseReference(p){ return p.Match(Keywords.Min); }
  ParseParameters(p){ return this.ParseCSN() && this.ParseValue(); }
}

export class Max extends Math
{
  ParseReference(p){ return p.Match(Keywords.Max); }
  ParseParameters(p){ return this.ParseCSN() && this.ParseValue(); }
}

// TODO: Implement
export class Clamp extends Math
{
  ParseReference(p){ return p.Match(Keywords.Clamp); }
  ParseParameters(p){ return p.Match(String); }
  ParseParameters(p){ return this.ParseCSN() && this.ParseCSN() && this.ParseValue(); }
}

// TODO: Implement
export class Calc extends Function
{
  ParseReference(p){ return p.Match(Keywords.Calc); }
  ParseParameters(p){ return p.Match(String); }
}

// TODO: Implement
export class Toggle extends Function
{
  ParseReference(p){ return p.Match(Keywords.Toggle); }
  ParseParameters(p){ return p.Match(String); }
}

// TODO: Implement
export class Attr extends Function
{
  ParseReference(p){ return p.Match(Keywords.Attr); }
}

export class RGB extends Function
{
  // (100% or 255) then optional whitespace then comma then optional whitespace
  CSN(p){ return (p.Match(Percent) || p.Match(Integer))?.WSO()?.Match(Symbols.Comma)?.WSO(); }

  ParseReference(p){ return p.Match(Keywords.RGB); }
  ParseParameters(p){ return this.CSN(p) && this.CSN(p) && (p.Match(Percent) || p.Match(Integer))?.WSO(); }
}

export class RGBA extends RGB
{
  ParseReference(p){ return p.Match(Keywords.RGBA); }
  ParseParameters(p){ return this.CSN(p) && this.CSN(p) && this.CSN(p) && (p.Match(Percent) || p.Match(Integer))?.WSO(); }
}

export class NamedColor extends Literal
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
