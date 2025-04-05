import {Tag} from "/js/Tag.js";

export class BR extends Tag
{
  static GetLocalName(){ return "br"; }
  static GetMetaURL(){ return import.meta.url; }
}
