import {Tag} from "/js/Tag.js";

export class Strong extends Tag
{
  static GetLocalName(){ return "strong"; }
  static GetMetaURL(){ return import.meta.url; }
}
