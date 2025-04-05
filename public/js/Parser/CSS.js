import {Parser} from "/js/Parser.js";
// import {StringLiteral} from "/js/Parser/HTML.js";
import {Tag} from "/js/Tag.js";
import {Style as StyleTag} from "/js/Tags/Style.js";
import {CSS as CSSTag} from "/js/Tags/CSS.js";
import {Connect} from "/js/Event/Connect.js";

class Token extends Tag
{
  static GetLocalName(){ return "token"; }

  [Connect](event)
  {
    this.AddClass(this.constructor.name);
  }
}

export class Symbol extends Token
{
  static GetLocalName(){ return "symbol"; }
}

export class OpenCurlyBracket extends Symbol { Parse(p){ return p.Read("{"); } }
export class CloseCurlyBracket extends Symbol { Parse(p){ return p.Read("}"); } }
export class OpenBracket extends Symbol { Parse(p){ return p.Read("["); } }
export class CloseBracket extends Symbol { Parse(p){ return p.Read("]"); } }
export class Colon extends Symbol { Parse(p){ return p.Read(":"); } }
export class SemiColon extends Symbol { Parse(p){ return p.Read(";"); } }
export class Dot extends Symbol { Parse(p){ return p.Read("."); } }
export class Asterisk extends Symbol { Parse(p){ return p.Read("*"); } }
export class Hash extends Symbol { Parse(p){ return p.Read("#"); } }
export class Pseudo extends Symbol { Parse(p){ return p.Read("::"); } }
export class Comma extends Symbol { Parse(p){ return p.Read(","); } }
export class Percent extends Symbol { Parse(p){ return p.Read("%"); } }
export class SingleQuote extends Symbol { Parse(p){ return p.Read("'"); } }
export class DoubleQuote extends Symbol { Parse(p){ return p.Read("\""); } }

export class Keyword extends Token
{
}

export class Solid extends Keyword { Parse(p){ return p.Read("solid"); } }
export class Dotted extends Keyword { Parse(p){ return p.Read("dotted"); } }

export class CM extends Keyword { Parse(p){ return p.Read("cm"); } }
export class MM extends Keyword { Parse(p){ return p.Read("mm"); } }
export class Q extends Keyword { Parse(p){ return p.Read("q"); } }
export class IN extends Keyword { Parse(p){ return p.Read("in"); } }
export class PC extends Keyword { Parse(p){ return p.Read("pc"); } }
export class PT extends Keyword { Parse(p){ return p.Read("pt"); } }
export class PX extends Keyword { Parse(p){ return p.Read("px"); } }
export class EM extends Keyword { Parse(p){ return p.Read("em"); } }
export class EX extends Keyword { Parse(p){ return p.Read("ex"); } }
export class CH extends Keyword { Parse(p){ return p.Read("ch"); } }
export class REM extends Keyword { Parse(p){ return p.Read("rem"); } }
export class LH extends Keyword { Parse(p){ return p.Read("lh"); } }
export class VW extends Keyword { Parse(p){ return p.Read("vw"); } }
export class VH extends Keyword { Parse(p){ return p.Read("vh"); } }
export class VMIN extends Keyword { Parse(p){ return p.Read("vmin"); } }
export class VMAX extends Keyword { Parse(p){ return p.Read("vmax"); } }

export class Literal extends Token
{
  static GetLocalName(){ return "literal"; }
}

export class StringLiteral extends Literal
{
  Parse(p)
  {
    let type;
    if      (p.Match(SingleQuote)) type = SingleQuote;
    else if (p.Match(DoubleQuote)) type = DoubleQuote;
    else return false;

    while (!p.Match(type))
    {
      if (p.IsDone()) return false;

      this.AppendText(p.Take());
    }

    return true;
  }
}

export class NumberLiteral extends Literal
{
  Parse(p)
  {
    const c = p.Next();
    if (c !== "-" && !p.IsDigit(c)) return false;

    const digits = [c];
    while (p.IsParsing())
    {
      const c = p.Current();
      if (c !== "." && !p.IsDigit(c)) break;

      digits.push(c);
      p.Next();
    }

    const value = Number(digits.join(""));
    if (Number.isNaN(value)) return false;

    this.Value(value);
    this.Text(value.toString());

    // These are all optional
    return p.Match(Percent)
        || p.Match(CM)
        || p.Match(MM)
        || p.Match(Q)
        || p.Match(IN)
        || p.Match(PC)
        || p.Match(PT)
        || p.Match(PX)
        || p.Match(EM)
        || p.Match(EX)
        || p.Match(CH)
        || p.Match(REM)
        || p.Match(LH)
        || p.Match(VW)
        || p.Match(VH)
        || p.Match(VMIN)
        || p.Match(VMAX)
        || true;
  }
}

export class ClassLiteral extends Literal
{
  Parse(p)
  {
    return p.Match(Dot) && p.Match(Name);
  }
}

export class HoverLiteral extends Literal { Parse(p){ return p.Match(Colon) && p.Match("hover"); } }
export class VisitedLiteral extends Literal { Parse(p){ return p.Match(Colon) && p.Match("visited"); } }

export class IdLiteral extends Literal
{
  Parse(p)
  {
    return p.Match(Hash) && p.Match(Name);
  }
}

export class HexLiteral extends Literal
{
  Parse(p)
  {
    if (!p.Match(Hash)) return false;

    const characters = [];
    while (p.IsParsing() && p.IsAlNum())
    {
      characters.push(p.Take());
    }

    const id = characters.join("");
    p.Save(id);
    this.Name(id);

    return true;
  }
}

export class WhiteSpace extends Token
{
  Parse(p)
  {
    let matched = false;

    while (p.IsParsing())
    {
      const c = p.Current();
      switch (c)
      {
        case "\n":
        {
          p.Save(c);
          p.position.Line();
          matched = true;
          break;
        }
        case " ":
        case "\t":
        case "\v":
        case "\f":
        case "\r":
        {
          p.Save(c);
          p.position.Move();
          matched = true;
          break;
        }

        // Non whitespace character, so we're done
        default: return matched;
      }
    }

    return matched;
  }
}

export class Name extends Token
{
  Parse(p)
  {
    const c = p.Next();
    if ((c !== "_") && (c !== "-") && !p.IsAlpha(c)) return false;

    const characters = [c];
    while (p.IsParsing())
    {
      const c = p.Current();
      if (c !== "_" && c !== "-" && !p.IsAlNum(c)) break;

      characters.push(c);
      p.Next();
    }

    const id = characters.join("");
    this.Text(id);
    this.Name(id);

    return true;
  }
}

export class Selector extends Token
{
  ParseHelper(p)
  {
    return p.Match(IdLiteral)
        || p.Match(ClassLiteral)
        // || p.Match(HoverLiteral)
        // || p.Match(VisitedLiteral)
        || false;
  }

  Parse(p)
  {
    if (this.ParseHelper(p))
    {
      return true;
    }

    if (p.Match(Asterisk))
    {
      return true;
    }
    else if (p.Match(Dot) || p.Match(Hash))
    {
      if (p.Match(Name))
      {
        p.Match(WhiteSpace);

        if (p.Match(Pseudo) || p.Match(Colon))
        {
          p.Match(WhiteSpace);

          p.Match(Name);
        }
      }

      return true;
    }
    else if (p.Match(Name))
    {
      p.Match(WhiteSpace);

      if (p.Match(Pseudo) || p.Match(Colon))
      {
        p.Match(WhiteSpace);

        p.Match(Name);
      }

      return true;
    }

    return false;
  }
}

export class Style extends Token
{
  ParseKeyword(p)
  {
    return p.Match(HexLiteral)
        || false;
  }

  ParseValue(p)
  {
    return p.Match(HexLiteral)
        || p.Match(StringLiteral)
        || p.Match(NumberLiteral)
        || false;
  }

  Parse(p)
  {
    if (!p.Match(Name)) return false;

    p.Match(WhiteSpace);

    if (!p.Match(Colon)) return false;

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

export class Rule extends Token
{
  Parse(p)
  {
    if (!p.Match(Selector)) return false;

    while (p.Match(Comma))
    {
      p.Match(WhiteSpace);
      if (!p.Match(Selector))
      {
        break;
      }
    }

    p.Match(WhiteSpace);

    if (p.Match(OpenCurlyBracket))
    {
      p.Match(WhiteSpace);

      while (!p.Match(CloseCurlyBracket))
      {
        p.Match(WhiteSpace);

        if (!p.Match(Style))
        {
          break;
        }

        // if (!p.Match(Rule))
        // if (!p.Match(Style) && !p.Parse())
        // {
        //   return false;
        // }
      }

      return true;
    }
  }

  Parse(p)
  {
    let selectors = 0;
    while (p.Match(Selector))
    {
      selectors += 1;
      p.Match(WhiteSpace);
      p.Match(Comma);
      p.Match(WhiteSpace);
    }

    if (selectors === 0) return false;

    // if (!p.Match(Selector)) return false;

    p.Match(WhiteSpace);

    if (p.Match(OpenCurlyBracket))
    {
      while (p.IsParsing())
      {
        p.Match(WhiteSpace);

        if (!p.Match(Style))
        {
          break;
        }
      }

      return p.Match(CloseCurlyBracket);

      // do
      // {
      //   p.Match(WhiteSpace);
      //
      //   if (!p.Match(Style) && !p.Parse())
      //   {
      //     console.log("Rule failed");
      //     return false;
      //   }
      // }
      // while (!p.Match(CloseCurlyBracket));

      // while (!p.Match(CloseCurlyBracket))
      // {
      //   p.Match(WhiteSpace);
      //
      //   if (!p.Match(Style))
      //   {
      //     break;
      //   }
      // }

      // return true;
    }
  }
}

export class CSS extends Parser
{
  Begin(...args)
  {
    const result = super.Begin(...args);

    if (result)
    {
      const Style = StyleTag;
      const CSS = CSSTag;

      result.AddFirst(
        new Style().Add(
          new CSS("token.Rule").Color("#abb2bf"),
          new CSS("token.Selector").Color("#e06c75"),
          new CSS("symbol").Color("#abb2bf"),
          new CSS("literal").Add(
            new CSS(".NumberLiteral").Color("#d19a66"),
            new CSS(".HexLiteral").Color("#d19a66"),
            new CSS(".StringLiteral").Color("#98c379"),
          ),
        ),
      );
    }

    return result;
  }

  Parse()
  {
    return this.Match(Rule)
        || super.Parse();
  }
}
