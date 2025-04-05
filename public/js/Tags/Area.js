import {Tag} from "/js/Tag.js";

export class Area extends Tag
{
  static GetLocalName(){ return "area"; }
  static GetMetaURL(){ return import.meta.url; }
}
