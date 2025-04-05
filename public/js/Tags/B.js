import {Tag} from "/js/Tag.js";

export class B extends Tag
{
  static GetLocalName(){ return "b"; }
  static GetMetaURL(){ return import.meta.url; }
}
