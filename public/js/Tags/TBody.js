import {Tag} from "/js/Tag.js";

export class TBody extends Tag
{
  static GetLocalName(){ return "tbody"; }
  static GetMetaURL(){ return import.meta.url; }
}
