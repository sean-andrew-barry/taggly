import {Parser} from "/js/Parser.js";
import {Tag} from "/js/Tag.js";
import {Token} from "/js/Tags/Token.js";
import {WhiteSpace} from "/js/Tags/Token/WhiteSpace.js";
import {OpenBrace} from "/js/Tags/Token/Symbol/OpenBrace.js";
import {CloseBrace} from "/js/Tags/Token/Symbol/CloseBrace.js";
import {Not} from "/js/Tags/Token/Symbol/Not.js";
import {Equal} from "/js/Tags/Token/Symbol/Equal.js";
import {Slash} from "/js/Tags/Token/Symbol/Slash.js";
import {SingleQuote} from "/js/Tags/Token/Symbol/SingleQuote.js";
import {DoubleQuote} from "/js/Tags/Token/Symbol/DoubleQuote.js";
import {Style} from "/js/Tags/Style.js";
import {CSS} from "/js/Tags/CSS.js";

export class Em extends Token { Parse(p){ return p.Read("em"); } }

export class DocType extends Token { Parse(p){ return p.Match(Not) && p.Read("DOCTYPE") && p.SkipWhiteSpace() && p.Read("html"); } }

export class StringLiteral extends Token
{
  Parse(parser)
  {
    let type;
    if      (parser.Match(SingleQuote)) type = SingleQuote;
    else if (parser.Match(DoubleQuote)) type = DoubleQuote;
    else return false;

    let text = "";
    while (!parser.Match(type))
    {
      if (parser.IsDone()) return false;

      // this.AppendText(parser.Take());

      text += parser.Take();
    }

    return true;
  }

  GetClosingCharacter(type)
  {
    switch (type)
    {
      case SingleQuote: return "'";
      case DoubleQuote: return "\"";
      default: throw new Error(`Unknown closing character type`);
    }
  }

  Parse(parser)
  {
    let type;
    if      (parser.Match(SingleQuote)) type = SingleQuote;
    else if (parser.Match(DoubleQuote)) type = DoubleQuote;
    else return false;

    const closing = this.GetClosingCharacter(type);

    let text = "";
    while (true)
    {
      // Fail if we hit the end of the input before finding the closing character
      if (parser.IsDone()) return false;

      const c = parser.Current();

      if (c === closing)
      {
        parser.Save(text);
        text = "";

        parser.Match(type);
        return true;
      }

      text += c;
      parser.Next();
    }

    return true;
  }

  Describe(){ return this.AddClass("string"); }
}

export class Attribute extends Token
{
  Parse(p)
  {
    return p.Match(Identifier)
        && p.Match(Equal)
        && p.Match(StringLiteral);
  }
}

export class OpenElement extends Token
{
  Parse(p)
  {
    if (!p.Match(OpenBrace)) return false;

    p.Match(WhiteSpace);

    if (p.Match(Identifier))
    {
      while (!p.Match(CloseBrace))
      {
        p.Match(WhiteSpace)
        p.Match(Attribute);
        p.Match(WhiteSpace)
      }

      return true;
    }

    return false;
  }
}

export class CloseElement extends Token
{
  Parse(p)
  {
    if (!p.Match(OpenBrace)) return false;

    p.Match(WhiteSpace);

    if (!p.Match(Slash)) return false;

    p.Match(WhiteSpace);

    if (p.Match(Identifier))
    {
      p.Match(WhiteSpace);

      if (p.Match(CloseBrace))
      {
        return true;
      }
    }

    return false;
  }
}

export class Identifier extends Token
{
  Parse(p)
  {
    const c = p.Next();
    if ((c !== "$") && (c !== "_") && !p.IsAlpha(c)) return false;

    const characters = [c];
    while (p.IsParsing())
    {
      const c = p.Current();
      if (c !== "_" && !p.IsAlNum(c)) break;

      characters.push(c);
      p.Next();
    }

    const id = characters.join("");
    this.Text(id);
    this.Name(id);

    return true;
  }
}

export class Text extends Token
{
  Parse(p)
  {
    const characters = [];
    while (p.IsParsing())
    {
      const c = p.Current();
      if (c === "<") break;

      characters.push(c);
      p.Next();
    }

    const id = characters.join("");
    // this.Text(id);
    // this.Name(id);

    return true;
  }
}

export class HTML extends Parser
{
  static GetStyle()
  {
    if (this.style) return this.style;

    const constant_color = "#d19a66";
    const string_color = "#98c379";
    const object_color = "#e5c07b";
    const function_name = "#61afef";

    return this.style = new Style().Add(
      new CSS(".Class + .WhiteSpace + .Identifier").Color(object_color),
      new CSS(".Extends + .WhiteSpace + .Identifier").Color(object_color),
      new CSS(".New + .WhiteSpace + .Identifier").Color(object_color),
      new CSS(".Function + .WhiteSpace + .Identifier").Color(function_name),

      new CSS("symbol").Color("#abb2bf"),
      new CSS("keyword").Color("#c678dd"),
      new CSS("token.Identifier").Color("#e06c75"),
      new CSS("token.StringLiteral, token.StringLiteral > symbol").Color(string_color),
      new CSS("token.Attribute > token.Identifier").Color(constant_color),
      new CSS("comment, comment > symbol").Color("#5c6370").FontStyleItalic(),
    );
  }

  Begin(...args)
  {
    const result = super.Begin(...args);

    if (result)
    {
      result.Prepend(
        this.constructor.GetStyle(),
      );
    }

    return result;
  }

  ParseAttribute()
  {
    return this.Match(Identifier);
  }

  ParseNode()
  {
    if (!this.Match(OpenBrace)) return false;

    // this.SkipWhiteSpace();

    while (!this.Match(CloseBrace))
    {
      if (this.Match(DocType))
      {
        // this.SkipWhiteSpace();

        return this.Expect();
      }
    }
  }

  Parse()
  {
    return this.Match(Attribute)
        || this.Match(CloseElement)
        || this.Match(OpenElement)
        || this.Match(OpenBrace)
        || this.Match(CloseBrace)
        || this.Match(WhiteSpace)
        || this.Match(DocType)
        || this.Match(Equal)
        || this.Match(Slash)
        || this.Match(StringLiteral)
        // || this.Match(Identifier)
        // || this.Match(Text)
        || super.Parse();
  }
}
