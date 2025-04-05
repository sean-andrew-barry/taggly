import {Tag} from "/js/Tag.js";

export class Samp extends Tag
{
  static GetLocalName(){ return "samp"; }
  static GetMetaURL(){ return import.meta.url; }
}
