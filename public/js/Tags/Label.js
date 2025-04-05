import {Tag} from "/js/Tag.js";

export class Label extends Tag
{
  static GetMetaURL(){ return import.meta.url; }
  static GetLocalName(){ return "label"; }
}
