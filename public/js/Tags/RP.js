import {Tag} from "/js/Tag.js";

export class RP extends Tag
{
  static GetLocalName(){ return "rp"; }
  static GetMetaURL(){ return import.meta.url; }
}
