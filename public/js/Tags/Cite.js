import {Tag} from "/js/Tag.js";

export class Cite extends Tag
{
  static GetMetaURL(){ return import.meta.url; }
  static GetLocalName(){ return "cite"; }
}
