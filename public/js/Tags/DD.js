import {Tag} from "/js/Tag.js";

export class DD extends Tag
{
  static GetLocalName(){ return "dd"; }
  static GetMetaURL(){ return import.meta.url; }
}
