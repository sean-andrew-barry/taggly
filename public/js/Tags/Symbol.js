import {Tag} from "/js/Tag.js";

export class Symbol extends Tag
{
  static GetLocalName(){ return "symbol"; }
  static GetMetaURL(){ return import.meta.url; }
}
