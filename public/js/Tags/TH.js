import {Tag} from "/js/Tag.js";

export class TH extends Tag
{
  static GetLocalName(){ return "th"; }
  static GetMetaURL(){ return import.meta.url; }
}
