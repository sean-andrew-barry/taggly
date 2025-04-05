import {Tag} from "/js/Tag.js";

export class Option extends Tag
{
  static GetMetaURL(){ return import.meta.url; }
  static GetLocalName(){ return "option"; }
}
