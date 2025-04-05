import {Tag} from "/js/Tag.js";

export class H1 extends Tag
{
  static GetLocalName(){ return "h1"; }
  static GetMetaURL(){ return import.meta.url; }
}
