import {Tag} from "/js/Tag.js";

export class I extends Tag
{
  static GetLocalName(){ return "i"; }
  static GetMetaURL(){ return import.meta.url; }
}
