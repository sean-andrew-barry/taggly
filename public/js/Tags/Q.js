import {Tag} from "/js/Tag.js";

export class Q extends Tag
{
  static GetLocalName(){ return "q"; }
  static GetMetaURL(){ return import.meta.url; }
}
