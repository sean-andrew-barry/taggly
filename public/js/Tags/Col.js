import {Tag} from "/js/Tag.js";

export class Col extends Tag
{
  static GetLocalName(){ return "col"; }
  static GetMetaURL(){ return import.meta.url; }
}
