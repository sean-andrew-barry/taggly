// (function ExtractTableColumn(index = 0)
// {
//   const cells = [];
//
//   const rows = document.querySelectorAll("tbody > tr");
//   for (const row of Array.from(rows))
//   {
//     const data = row.querySelectorAll("td");
//     const cell = data[index];
//     if (cell) cells.push(cell);
//   }
//
//   return cells.map(c => c.textContent);
// })(0);

const NAMES = {
  "background": "background",
  "background-attachment": "backgroundAttachment",
  "background-color": "backgroundColor",
  "background-image": "backgroundImage",
  "background-position": "backgroundPosition",
  "background-repeat": "backgroundRepeat",
  "border": "border",
  "border-bottom": "borderBottom",
  "border-bottom-color": "borderBottomColor",
  "border-bottom-style": "borderBottomStyle",
  "border-bottom-width": "borderBottomWidth",
  "border-color": "borderColor",
  "border-left": "borderLeft",
  "border-left-color": "borderLeftColor",
  "border-left-style": "borderLeftStyle",
  "border-left-width": "borderLeftWidth",
  "border-right": "borderRight",
  "border-right-color": "borderRightColor",
  "border-right-style": "borderRightStyle",
  "border-right-width": "borderRightWidth",
  "border-style": "borderStyle",
  "border-top": "borderTop",
  "border-top-color": "borderTopColor",
  "border-top-style": "borderTopStyle",
  "border-top-width": "borderTopWidth",
  "border-width": "borderWidth",
  "clear": "clear",
  "clip": "clip",
  "color": "color",
  "cursor": "cursor",
  "display": "display",
  "filter": "filter",
  "float": "cssFloat",
  "font": "font",
  "font-family": "fontFamily",
  "font-size": "fontSize",
  "font-variant": "fontVariant",
  "font-weight": "fontWeight",
  "height": "height",
  "left": "left",
  "letter-spacing": "letterSpacing",
  "line-height": "lineHeight",
  "list-style": "listStyle",
  "list-style-image": "listStyleImage",
  "list-style-position": "listStylePosition",
  "list-style-type": "listStyleType",
  "margin": "margin",
  "margin-bottom": "marginBottom",
  "margin-left": "marginLeft",
  "margin-right": "marginRight",
  "margin-top": "marginTop",
  "overflow": "overflow",
  "padding": "padding",
  "padding-bottom": "paddingBottom",
  "padding-left": "paddingLeft",
  "padding-right": "paddingRight",
  "padding-top": "paddingTop",
  "page-break-after": "pageBreakAfter",
  "page-break-before": "pageBreakBefore",
  "position": "position",
  "stroke-dasharray": "strokeDasharray",
  "stroke-dashoffset": "strokeDashoffset",
  "text-align": "textAlign",
  "text-decoration": "textDecoration",
  "text-indent": "textIndent",
  "text-transform": "textTransform",
  "top": "top",
  "vertical-align": "verticalAlign",
  "visibility": "visibility",
  "width": "width",
  "z-index": "zIndex",
};

export class Token
{

}

export class Parser
{
  constructor(string, start = 0, end = string.length)
  {
    this.string = string;
    this.start = start;
    this.end = end;
  }

  Parse()
  {
    this.Next();
  }

  *[Symbol.iterator]()
  {
    while (this.IsRunning())
    {
      yield* this.Parse();
    }
  }

  [Symbol.iterator]()
  {
    let index = this.start;

    return {
      next: () =>
      {
        if (index < this.end)
        {
          const token = this.Parse();

          if (token)
          {
            // if (typeof(token[Symbol.iterator]) === "function")
            // {
            //   sub_iterator = token[Symbol.iterator]();
            //   return sub_iterator.next();
            // }

            index += token.GetLength();

            return {
              value: token,
              done: false,
            };
          }
        }

        return {
          done: true,
        };
      },
      [Symbol.iterator]: function(){ return this; },
    };
  }
}

export class WhiteSpace extends Token
{
  Parse(p)
  {
    let space = "";
    let c = this.Current();
    while (this.IsSpace(c))
    {
      space += c;
      c = this.Next();
    }

    return space;
  }
}

export class Rules extends Parser
{
  WhiteSpace()
  {
    // let space = this.Current();
    let space = "";
    let c = this.Current();
    while (this.IsSpace(c))
    {
      space += c;
      c = this.Next();
    }

    return space;
  }

  Parse(tokens)
  {
    return this.WhiteSpace()
        || this.Property()
        ;
  }
}

export class ParserCSS extends Parser
{
  ReadBackgroundColor(){ return this.Color() || this.Transparent() || this.Inherit(); }
  Border(){ return this.Color() || this.Transparent() || this.Inherit(); }

  ReadProperty()
  {
    const c = this.Next();
    if (c !== "-" && !this.IsAlpha(c)) return false;

    const characters = [c];
    while (this.IsParsing())
    {
      const c = this.Current();
      if (c !== "_" && !this.IsAlpha(c)) break;

      characters.push(c);
      this.Next();
    }

    const property = characters.join("");

    switch (property)
    {
      case "azimuth":
      case "background":
      case "background-attachment":
      case "background-color":
      case "background-image":
      case "background-position":
      case "background-repeat":
      case "border":
      case "border-collapse":
      case "border-color":
      case "border-spacing":
      case "border-style":
      case "border-top":
      case "border-right":
      case "border-bottom":
      case "border-left":
      case "border-top-color":
      case "border-right-color":
      case "border-bottom-color":
      case "border-left-color":
      case "border-top-style":
      case "border-right-style":
      case "border-bottom-style":
      case "border-left-style":
      case "border-top-width":
      case "border-right-width":
      case "border-bottom-width":
      case "border-left-width":
      case "border-width":
      case "bottom":
      case "caption-side":
      case "clear":
      case "clip":
      case "color":
      case "content":
      case "counter-increment":
      case "counter-reset":
      case "cue":
      case "cue-after":
      case "cue-before":
      case "cursor":
      case "direction":
      case "display":
      case "elevation":
      case "empty-cells":
      case "float":
      case "font":
      case "font-family":
      case "font-size":
      case "font-size-adjust":
      case "font-stretch":
      case "font-style":
      case "font-variant":
      case "font-weight":
      case "height":
      case "left":
      case "letter-spacing":
      case "line-height":
      case "list-style":
      case "list-style-image":
      case "list-style-position":
      case "list-style-type":
      case "margin":
      case "margin-top":
      case "margin-right":
      case "margin-bottom":
      case "margin-left":
      case "marker-offset":
      case "marks":
      case "max-height":
      case "max-width":
      case "min-height":
      case "min-width":
      case "orphans":
      case "outline":
      case "outline-color":
      case "outline-style":
      case "outline-width":
      case "overflow":
      case "padding":
      case "padding-top":
      case "padding-right":
      case "padding-bottom":
      case "padding-left":
      case "page":
      case "page-break-after":
      case "page-break-before":
      case "page-break-inside":
      case "pause":
      case "pause-after":
      case "pause-before":
      case "pitch":
      case "pitch-range":
      case "play-during":
      case "position":
      case "quotes":
      case "richness":
      case "right":
      case "size":
      case "speak":
      case "speak-header":
      case "speak-numeral":
      case "speak-punctuation":
      case "speech-rate":
      case "stress":
      case "table-layout":
      case "text-align":
      case "text-decoration":
      case "text-indent":
      case "text-shadow":
      case "text-transform":
      case "top":
      case "unicode-bidi":
      case "vertical-align":
      case "visibility":
      case "voice-family":
      case "volume":
      case "white-space":
      case "widows":
      case "width":
      case "word-spacing":
      case "z-index":
      {
        return property;
      }
      default:
      {
        throw new Error(`Unknown css property "${property}"`);
      }
    }
  }

  *[Symbol.iterator]()
  {
    this.stack = [];

    while (this.IsRunning())
    {
      this.SkipWhiteSpace();

      const property = this.ReadProperty();

      this.SkipWhiteSpace();

      const value = this.ReadValue();

      this.SkipWhiteSpace();

      yield {
        property,
        value,
        priority,
      };
    }
  }
}

export class CSSStyleDeclaration
{
  #parentRule = null;
  #properties = new Map();
  #priorities = new Map();

  get length(){ return this.#properties.size; }

  get cssText(){}
  set cssText(cssText)
  {
    for (const rule of new Rules(cssText))
    {

    }

    // TODO: Needs to parse the cssText into property/value/priority objects
    this.#properties.clear();
    this.#priorities.clear();

    throw new Error("Not implemented");
  }

  get parentRule(){ return this.#parentRule; }

  getPropertyPriority(property)
  {
    if (this.#priorities.has(property))
    {
      return this.#priorities.get(property);
    }
    else
    {
      return "";
    }
  }

  getPropertyValue(property)
  {
    if (this.#properties.has(property))
    {
      return this.#properties.get(property).toString();
    }
    else
    {
      return "";
    }
  }

  item(index)
  {
    if (index >= this.length) return null;

    let i = 0;
    for (const value of this.#properties.values())
    {
      if (i === index) return value;
      else i += 1;
    }

    return "";
  }

  removeProperty(property)
  {
    if (this.#properties.has(property))
    {
      this.#properties.delete(property);
      this.#priorities.delete(property);
    }
  }

  setProperty(property, value, priority)
  {
    if (value === undefined) return;

    this.#properties.set(property, value);
    this.#priorities.set(property, priority);
  }
}
