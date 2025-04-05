import {Tag} from "/js/Tag.js";

export class UL extends Tag
{
  static GetLocalName(){ return "ul"; }
  static GetMetaURL(){ return import.meta.url; }
}
