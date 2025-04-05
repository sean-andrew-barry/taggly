import {Tag} from "/js/Tag.js";

export class THead extends Tag
{
  static GetLocalName(){ return "thead"; }
  static GetMetaURL(){ return import.meta.url; }
}
