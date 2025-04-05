import {Tag} from "/js/Tag.js";

export class Del extends Tag
{
  static GetLocalName(){ return "del"; }
  static GetMetaURL(){ return import.meta.url; }
}
