import {Tag} from "/js/Tag.js";

export class H2 extends Tag
{
  static GetLocalName(){ return "h2"; }
  static GetMetaURL(){ return import.meta.url; }
}
