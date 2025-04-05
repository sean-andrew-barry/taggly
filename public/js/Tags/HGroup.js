import {Tag} from "/js/Tag.js";

export class HGroup extends Tag
{
  static GetLocalName(){ return "hgroup"; }
  static GetMetaURL(){ return import.meta.url; }
}
