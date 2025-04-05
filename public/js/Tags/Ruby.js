import {Tag} from "/js/Tag.js";

export class Ruby extends Tag
{
  static GetLocalName(){ return "ruby"; }
  static GetMetaURL(){ return import.meta.url; }
}
