import {Tag} from "/js/Tag.js";

export class WBR extends Tag
{
  static GetLocalName(){ return "wbr"; }
  static GetMetaURL(){ return import.meta.url; }
}
