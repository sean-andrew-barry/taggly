import {Tag} from "/js/Tag.js";

export class Span extends Tag
{
  static GetMetaURL(){ return import.meta.url; }
  static GetLocalName(){ return "span"; }
}
