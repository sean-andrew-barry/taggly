import {Tag} from "/js/Tag.js";

export class H3 extends Tag
{
  static GetLocalName(){ return "h3"; }
  static GetMetaURL(){ return import.meta.url; }
}
