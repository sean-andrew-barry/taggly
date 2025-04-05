import {Tag} from "/js/Tag.js";

export class TR extends Tag
{
  static GetLocalName(){ return "tr"; }
  static GetMetaURL(){ return import.meta.url; }
}
