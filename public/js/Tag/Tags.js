import {Tag} from "/js/Tag.js";

export class Anchor          extends Tag { static GetNodeName(){ return "a"; } }
export class Image           extends Tag { static GetNodeName(){ return "img"; } }
export class Span            extends Tag { static GetNodeName(){ return "span"; } }
export class Abbreviation    extends Tag { static GetNodeName(){ return "abbr"; } }
export class Address         extends Tag { static GetNodeName(){ return "address"; } }
export class Article         extends Tag { static GetNodeName(){ return "article"; } }
export class Audio           extends Tag { static GetNodeName(){ return "audio"; } }
export class Area            extends Tag { static GetNodeName(){ return "area"; } }
export class AreaMap         extends Tag { static GetNodeName(){ return "map"; } }
export class Aside           extends Tag { static GetNodeName(){ return "aside"; } }
export class Base            extends Tag { static GetNodeName(){ return "base"; } }
export class Bold            extends Tag { static GetNodeName(){ return "b"; } }
export class Body            extends Tag { static GetNodeName(){ return "body"; } }
export class BreakLine       extends Tag { static GetNodeName(){ return "br"; } }
export class Button          extends Tag { static GetNodeName(){ return "button"; } }
export class BlockQuote      extends Tag { static GetNodeName(){ return "blockquote"; } }
export class Cite            extends Tag { static GetNodeName(){ return "cite"; } }
export class Code            extends Tag { static GetNodeName(){ return "code"; } }
export class Canvas          extends Tag { static GetNodeName(){ return "canvas"; } }
export class Column          extends Tag { static GetNodeName(){ return "col"; } }
export class ColumnGroup     extends Tag { static GetNodeName(){ return "colgroup"; } }
export class Data            extends Tag { static GetNodeName(){ return "data"; } }
export class DataList        extends Tag { static GetNodeName(){ return "datalist"; } }
export class Deleted         extends Tag { static GetNodeName(){ return "del"; } }
export class Details         extends Tag { static GetNodeName(){ return "details"; } }
export class Dialog          extends Tag { static GetNodeName(){ return "dialog"; } }
export class Div             extends Tag { static GetNodeName(){ return "div"; } }
export class Definition      extends Tag { static GetNodeName(){ return "dfn"; } }
export class DescriptionData extends Tag { static GetNodeName(){ return "dd"; } }
export class DescriptionList extends Tag { static GetNodeName(){ return "dl"; } }
export class DescriptionTerm extends Tag { static GetNodeName(){ return "dt"; } }
export class Emphasis        extends Tag { static GetNodeName(){ return "em"; } }
export class Embed           extends Tag { static GetNodeName(){ return "embed"; } }
export class ExternalObject  extends Tag { static GetNodeName(){ return "object"; } }
export class ExternalParam   extends Tag { static GetNodeName(){ return "param"; } }
export class Figure          extends Tag { static GetNodeName(){ return "figure"; } }
export class FigureCaption   extends Tag { static GetNodeName(){ return "figcaption"; } }
export class Footer          extends Tag { static GetNodeName(){ return "footer"; } }
export class Head            extends Tag { static GetNodeName(){ return "head"; } }
export class Header          extends Tag { static GetNodeName(){ return "header"; } }
export class Header1         extends Tag { static GetNodeName(){ return "h1"; } }
export class Header2         extends Tag { static GetNodeName(){ return "h2"; } }
export class Header3         extends Tag { static GetNodeName(){ return "h3"; } }
export class Header4         extends Tag { static GetNodeName(){ return "h4"; } }
export class Header5         extends Tag { static GetNodeName(){ return "h5"; } }
export class Header6         extends Tag { static GetNodeName(){ return "h6"; } }
export class HeaderGroup     extends Tag { static GetNodeName(){ return "hgroup"; } }
export class HorizontalRule  extends Tag { static GetNodeName(){ return "hr"; } }
// export class HTML            extends Tag { static GetNodeName(){ return "html"; } }
export class Italic          extends Tag { static GetNodeName(){ return "i"; } }
export class InlineFrame     extends Tag { static GetNodeName(){ return "iframe"; } }
// export class Image           extends Tag { static GetNodeName(){ return "img"; } }
export class Input           extends Tag { static GetNodeName(){ return "input"; } }
export class Inserted        extends Tag { static GetNodeName(){ return "ins"; } }
export class KeyboardInput   extends Tag { static GetNodeName(){ return "kbd"; } }
export class Label           extends Tag { static GetNodeName(){ return "label"; } }
export class Legend          extends Tag { static GetNodeName(){ return "legend"; } }
export class ListItem        extends Tag { static GetNodeName(){ return "li"; } }
export class Link            extends Tag { static GetNodeName(){ return "link"; } }
export class Main            extends Tag { static GetNodeName(){ return "main"; } }
export class Mark            extends Tag { static GetNodeName(){ return "mark"; } }
export class Menu            extends Tag { static GetNodeName(){ return "menu"; } }
export class MenuItem        extends Tag { static GetNodeName(){ return "menuitem"; } }
export class Meter           extends Tag { static GetNodeName(){ return "meter"; } }
export class Nav             extends Tag { static GetNodeName(){ return "nav"; } }
export class NoScript        extends Tag { static GetNodeName(){ return "noscript"; } }
export class OrderedList     extends Tag { static GetNodeName(){ return "ol"; } }
export class Option          extends Tag { static GetNodeName(){ return "option"; } }
export class OptionGroup     extends Tag { static GetNodeName(){ return "optgroup"; } }
export class Output          extends Tag { static GetNodeName(){ return "output"; } }
export class Paragraph       extends Tag { static GetNodeName(){ return "p"; } }
export class Picture         extends Tag { static GetNodeName(){ return "picture"; } }
export class Pre             extends Tag { static GetNodeName(){ return "pre"; } }
export class Progress        extends Tag { static GetNodeName(){ return "progress"; } }
export class Quote           extends Tag { static GetNodeName(){ return "q"; } }
export class Strike          extends Tag { static GetNodeName(){ return "s"; } }
export class Sample          extends Tag { static GetNodeName(){ return "samp"; } }
export class SubScript       extends Tag { static GetNodeName(){ return "sub"; } }
export class SuperScript     extends Tag { static GetNodeName(){ return "sup"; } }
export class Section         extends Tag { static GetNodeName(){ return "section"; } }
export class Select          extends Tag { static GetNodeName(){ return "select"; } }
export class Small           extends Tag { static GetNodeName(){ return "small"; } }
// export class Span            extends Tag { static GetNodeName(){ return "span"; } }
export class Strong          extends Tag { static GetNodeName(){ return "strong"; } }
export class Style           extends Tag { static GetNodeName(){ return "style"; } }
export class Source          extends Tag { static GetNodeName(){ return "source"; } }
export class Summary         extends Tag { static GetNodeName(){ return "summary"; } }
export class Table           extends Tag { static GetNodeName(){ return "table"; } }
export class TextArea        extends Tag { static GetNodeName(){ return "textarea"; } }
export class TableFoot       extends Tag { static GetNodeName(){ return "tfoot"; } }
export class TableHeader     extends Tag { static GetNodeName(){ return "th"; } }
export class TableHead       extends Tag { static GetNodeName(){ return "thead"; } }
export class TableBody       extends Tag { static GetNodeName(){ return "tbody"; } }
export class TableRow        extends Tag { static GetNodeName(){ return "tr"; } }
export class TableData       extends Tag { static GetNodeName(){ return "td"; } }
export class FieldSet        extends Tag { static GetNodeName(){ return "fieldset"; } }
export class Time            extends Tag { static GetNodeName(){ return "time"; } }
export class Title           extends Tag { static GetNodeName(){ return "title"; } }
export class Track           extends Tag { static GetNodeName(){ return "track"; } }
export class Template        extends Tag { static GetNodeName(){ return "template"; } }
export class UnorderedList   extends Tag { static GetNodeName(){ return "ul"; } }
export class Var             extends Tag { static GetNodeName(){ return "var"; } }
export class Video           extends Tag { static GetNodeName(){ return "video"; } }

export class Form extends Tag
{
  static GetNodeName(){ return "form"; }

  GetValues()
  {
    const values = {};
    const inputs = this.QueryAll("input, textarea");
    for (let i = 0; i < inputs.length; i++)
    {
      const input = inputs[i];

      let value;
      switch (input.GetType())
      {
        case "checkbox":
        {
          value = input.IsChecked();
          break;
        }
        case "radio":
        {
          value = input.IsChecked();
          break;
        }
        default:
        {
          value = input.GetValue();
        }
      }

      const names = (input.GetID() || input.GetName() || "").split(".");
      const key = names.pop();
      let current = values;
      for (let i = 0; i < names.length; i++)
      {
        const name = names[i];
        const next = names[i + 1];

        if (next === "0")
        {
          current = current[name] || (current[name] = []);
        }
        else
        {
          current = current[name] || (current[name] = {});
        }
      }

      current[key] = value;
    }

    return values;
  }
}

// export class HTML extends Tag
// {
//   constructor(c)
//   {
//     super("html", c);
//     // document.documentElement = this.node;
//     document.replaceChild(this.node, document.documentElement);
//   }
// }

class XML extends Tag
{
  constructor(type)
  {
    super(type);
  }

  // Since an XML tag is created differently (it uses its Render parameter as its node type),
  // it needs to be loaded from JSON differently
  static fromJSON(json)
  {
    const tag = new this();
    tag.Render(json.name);

    const keys = Object.keys(json.attributes);
    for (let i = 0; i < keys.length; i++)
    {
      const key = keys[i];
      const val = json.attributes[key];

      tag.SetAttribute(key, val);
    }

    if (json.text)
    {
      tag.Text(json.text);
    }
    else
    {
      for (let i = 0; i < json.children.length; i++)
      {
        tag.Add(Tag.fromJSON(json.children[i]));
      }
    }

    return tag;
  }
}

export class Meta extends Tag
{
  constructor(c)
  {
    super("meta", c);
  }

  Charset(v){ return this.SetAttribute("charset", v); }
  Content(v){ return this.SetAttribute("content", v); }
  Property(v){ return this.SetAttribute("property", v); }

  // Open Graph Properties
  Title      (v){ return this.Property("og:title"           ).Content(v); }
  Description(v){ return this.Property("og:description"     ).Content(v); }
  Determiner (v){ return this.Property("og:determiner"      ).Content(v); }
  Locale     (v){ return this.Property("og:locale"          ).Content(v); }
  LocaleAlt  (v){ return this.Property("og:locale:alternate").Content(v); }
  SiteName   (v){ return this.Property("og:site_name"       ).Content(v); }
  Type       (v){ return this.Property("og:type"            ).Content(v); }
  Url        (v){ return this.Property("og:url"             ).Content(v); }

  EnUS(v){ return this.Locale("en_US"); }
  EnGB(v){ return this.Locale("en_GB"); }
  DeterminerA(v){ return this.Determiner("a"); }
  DeterminerAn(v){ return this.Determiner("an"); }
  DeterminerThe(v){ return this.Determiner("the"); }
  DeterminerBlank(v){ return this.Determiner(""); }
  DeterminerAuto(v){ return this.Determiner("auto"); }

  ImageURL      (v){ return this.Property("og:image"           ).Content(v); }
  ImageSecureURL(v){ return this.Property("og:image:secure_url").Content(v); }
  ImageType     (v){ return this.Property("og:image:type"      ).Content(v); }
  ImageWidth    (v){ return this.Property("og:image:width"     ).Content(v); }
  ImageHeight   (v){ return this.Property("og:image:height"    ).Content(v); }
  ImageAlt      (v){ return this.Property("og:image:alt"       ).Content(v); }

  VideoURL      (v){ return this.Property("og:video"           ).Content(v); }
  VideoSecureURL(v){ return this.Property("og:video:secure_url").Content(v); }
  VideoType     (v){ return this.Property("og:video:type"      ).Content(v); }
  VideoWidth    (v){ return this.Property("og:video:width"     ).Content(v); }
  VideoHeight   (v){ return this.Property("og:video:height"    ).Content(v); }

  AudioURL      (v){ return this.Property("og:audio"           ).Content(v); }
  AudioSecureURL(v){ return this.Property("og:audio:secure_url").Content(v); }
  AudioType     (v){ return this.Property("og:audio:type"      ).Content(v); }

  ImageTypeJPG(){ return this.ImageType("image/jpg"); }
  ImageTypePNG(){ return this.ImageType("image/png"); }
  VideoTypeMP4(){ return this.VideoType("video/mp4"); }
  AudioTypeMP3(){ return this.AudioType("audio/mp3"); }
  TypeWebsite(){ return this.Type("website"); }
  TypeArticle(){ return this.Type("article"); }
}

export class Script extends Tag
{
  constructor(c)
  {
    super("script", c);
  }

  Body(fn)
  {
    const text = fn.toString();
    // const body = text.replace(/.+\{(.*)\}/s, (m, p1) =>
    const body = text.replace(/.+\{(.*)\}/, (m, p1) =>
    {
      return p1.split("\r\n").map(l => l.trim()).join("\r\n");
    });

    this.Text(body);
    return this;
  }
}

export class ErrorTag extends Tag
{
  constructor(error)
  {
    super("div", "error");
    this.error = error;

    console.error(error);
  }

  Render()
  {
    return super.Render(
      Tag.Div("content is-medium").Add(
        Tag.Div("notification is-danger").Add(
          Tag.Paragraph().Add(
            Tag.Span().Text(this.error.constructor.name),
            Tag.Span().Text(": "),
            Tag.Span().Text(this.error.message),
          ),
          this.error.stack && Tag.Div().Add(
            Tag.Div("content is-small").Add(
              Tag.Pre().Style("white-space: pre-wrap;").Add(
                Tag.Code().Text(this.error.stack),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

export class PromiseTag extends Tag
{
  constructor(value)
  {
    super("div", "promise");
    this.value = value;
  }
}

export class StringTag extends Tag
{
  constructor(value)
  {
    super(document.createTextNode(value), "string");
    this.value = value;
  }
}

export class NumberTag extends Tag
{
  constructor(value)
  {
    const original = value;
    if (NumberTag._formatter)
    {
      value = NumberTag._formatter.format(value);
    }
    else
    {
      value = value.toString();
    }

    super(document.createTextNode(value), "number");
    this.value = value;
    this.original = original;
  }
}

if (window.Intl && window.Intl.NumberFormat)
{
  NumberTag._formatter = new window.Intl.NumberFormat();
}

export class DateTag extends Tag
{
  constructor(value)
  {
    super(document.createTextNode(value.toLocaleString()), "date");
    this.value = value;
  }
}

export class ObjectTag extends Tag
{
  constructor(value)
  {
    super(document.createTextNode(JSON.stringify(value, undefined, 2)), "object");
    this.value = value;
  }
}
