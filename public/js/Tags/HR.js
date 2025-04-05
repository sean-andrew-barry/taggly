import {Tag} from "/js/Tag.js";

export class HR extends Tag
{
  static GetLocalName(){ return "hr"; }
  static GetMetaURL(){ return import.meta.url; }
}
