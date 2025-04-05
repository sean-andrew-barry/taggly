import {window} from "/js/Window.js";
import {Tag} from "/js/Tag.js";

export class Body extends Tag
{
  static GetLocalName(){ return "body"; }
  static GetMetaURL(){ return import.meta.url; }
  static Get(){ return this.GetDocument().GetBody(); }

  destructor()
  {
    this.Clear();
    return super.destructor();
  }
}
