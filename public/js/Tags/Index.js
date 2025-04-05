import {Tag} from "/js/Tag.js";

export class Index extends Tag
{
  static GetLocalName(){ return "index"; }
  static GetMetaURL(){ return import.meta.url; }
}
