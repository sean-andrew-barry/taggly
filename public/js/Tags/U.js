import {Tag} from "/js/Tag.js";

export class U extends Tag
{
  static GetLocalName(){ return "u"; }
  static GetMetaURL(){ return import.meta.url; }
}
