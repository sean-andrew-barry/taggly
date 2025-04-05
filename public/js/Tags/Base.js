import {Tag} from "/js/Tag.js";

export class Base extends Tag
{
  static GetLocalName(){ return "base"; }
  static GetMetaURL(){ return import.meta.url; }
}
