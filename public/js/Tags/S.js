import {Tag} from "/js/Tag.js";

export class S extends Tag
{
  static GetLocalName(){ return "s"; }
  static GetMetaURL(){ return import.meta.url; }
}
