import {Tag} from "/js/Tag.js";
import {Parser} from "/js/Tags/Parser.js";
import {Connect} from "/js/Event/Connect.js";

export class Text extends Tag
{
  static GetMetaURL(){ return import.meta.url; }
  static GetLocalName(){ return "#text"; }

  constructor(text)
  {
    super();

    if (typeof(text) === "string")
    {
      this.SetNode(this.constructor.CreateNodeText(text));
      // this.SetNode(this.constructor.CreateNode("#text"));
    }
    else if (text instanceof window.Text)
    {
      this.SetNode(text);
    }
    else if (text instanceof this.constructor)
    {
      this.SetNode(value.GetNode());
    }
  }

  Text(text)
  {
    this.GetNode().data = text;
    return this;
  }

  GetLength(){ return this.GetNode().length; }
  SetText(text){ this.GetNode().data = text; return this; }
  GetText(){ return this.GetNode().data; }
  SetValue(value){ this.GetNode().nodeValue = value; return this.SetText(value); }
  GetValue(){ return this.GetText(); }

  // The value of all text nodes logically adjacent to this node concatenated together in document order
  GetWholeText(){ return this.GetNode().wholeText; }

  IsMatch(selector){ return false; }
  Query(selector){ return false; }
  QueryAll(selector){ return false; }
  QueryEach(selector){ return false; }

  Deconvert(){ return this.GetText(); }

  Split(offset)
  {
    const split = this.GetNode().splitText(offset);

    // Create a new Text tag to hold the split text node
    return new this.constructor(split);
  }

  Subtext(start, end)
  {
    
  }

  // Break(start, end)
  // {
  //   const a = this.Split();
  //
  //   // Create a new Text tag to hold the split text node
  //   return new this.constructor(split);
  // }

  Extract(text)
  {
    const value = this.GetText();
    if (value === text) return;

    let index = -1;
    if (typeof(text) === "string")
    {
      index = value.indexOf(text);
    }
    else
    {
      index = value.search(text);
    }

    if (index >= 0)
    {
      const extracted = this.Split(index);
      const remainder = extracted.Split(text.length);

      return extracted;
    }
  }

  Extract(text)
  {
    const value = this.GetText();

    let index = -1;
    let length = 0;
    if (typeof(text) === "string")
    {
      if (value === text) return;
      index = value.indexOf(text);
      length = text.length;
    }
    else
    {
      if (value === text.source) return;
      index = value.search(text);
      length = text.source.length;
    }

    if (index >= 0)
    {
      const extracted = this.Split(index);
      const remainder = extracted.Split(length);

      return extracted;
    }
  }

  Erase(offset)
  {
    const node = this.GetNode();
    node.nodeValue = node.nodeValue.substring(offset);
    return this;
  }

  Merge()
  {
    const parent = this.GetParent();
    if (!parent) throw new Error(`A Text tag must have a parent tag to use Merge`);

    parent.Normalize();

    return undefined; // We return undefined because this node is not guaranteed to be valid
  }

  #parsed = false;
  IsParsed(){ return this.#parsed; }
  Parsed(parsed){ this.#parsed = parsed; return this; }

  Parse(parser)
  {
    this.Parsed(true);
  }

  ToPrettyHTML(indent = "")
  {
    return indent + this.GetText();
  }
}
