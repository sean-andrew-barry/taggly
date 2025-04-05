import {Tag} from "/js/Tag.js";

export class Comment extends Tag
{
  static GetMetaURL(){ return import.meta.url; }
  static GetLocalName(){ return "#comment"; }

  constructor(text)
  {
    super();

    if (typeof(text) === "string")
    {
      this.SetNode(this.constructor.CreateComment(text));
    }
    else if (text instanceof window.Comment)
    {
      this.SetNode(text);
    }
    else if (text instanceof this.constructor)
    {
      this.SetNode(value.GetNode());
    }
  }

  // SetNode(node = this.constructor.CreateText())
  SetText(text){ this.GetNode().nodeValue = text; return this; }
  GetText(){ return this.GetNode().nodeValue; }
  SetValue(value){ this.GetNode().nodeValue = value; return this.SetText(value); }
  GetValue(){ return this.GetText(); }

  GetWholeText(){ return this.GetNode().wholeText; }

  IsMatch(selector){ return false; }
  Query(selector){ return false; }
  QueryAll(selector){ return false; }
  QueryEach(selector){ return false; }

  Deconvert(){ return this.GetText(); }

  ToPrettyHTML(indent = "")
  {
    return indent + this.GetText();
  }
}
