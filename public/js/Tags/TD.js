import {Tag} from "/js/Tag.js";

export class TD extends Tag
{
  static GetLocalName(){ return "td"; }
  static GetMetaURL(){ return import.meta.url; }
}
