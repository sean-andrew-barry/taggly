import {Tag} from "/js/Tag.js";

export class Summary extends Tag
{
  static GetLocalName(){ return "summary"; }
  static GetMetaURL(){ return import.meta.url; }
}
