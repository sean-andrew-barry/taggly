import {Tag} from "/js/Tag.js";

export class FigCaption extends Tag
{
  static GetLocalName(){ return "figcaption"; }
  static GetMetaURL(){ return import.meta.url; }
}
