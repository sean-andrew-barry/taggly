import {Tag} from "/js/Tag.js";

export class NoScript extends Tag
{
  static GetLocalName(){ return "noscript"; }
  static GetMetaURL(){ return import.meta.url; }
}
