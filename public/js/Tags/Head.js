import {window} from "/js/Window.js";
import {Tag} from "/js/Tag.js";

export class Head extends Tag
{
  static GetLocalName(){ return "head"; }
  static GetMetaURL(){ return import.meta.url; }
  static Get(){ return this.GetDocument().GetHead(); }

  destructor()
  {
    this.Clear();
    return super.destructor();
  }
}
