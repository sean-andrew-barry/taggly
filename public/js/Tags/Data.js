import {Tag} from "/js/Tag.js";

export class Data extends Tag
{
  static GetLocalName(){ return "data"; }
  static GetMetaURL(){ return import.meta.url; }
}
