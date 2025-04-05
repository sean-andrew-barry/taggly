import {Tag} from "/js/Tag.js";

export class Details extends Tag
{
  static GetLocalName(){ return "details"; }
  static GetMetaURL(){ return import.meta.url; }
}
