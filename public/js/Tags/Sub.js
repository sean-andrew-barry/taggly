import {Tag} from "/js/Tag.js";

export class Sub extends Tag
{
  static GetLocalName(){ return "sub"; }
  static GetMetaURL(){ return import.meta.url; }
}
