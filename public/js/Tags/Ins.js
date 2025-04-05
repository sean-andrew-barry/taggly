import {Tag} from "/js/Tag.js";

export class Ins extends Tag
{
  static GetLocalName(){ return "ins"; }
  static GetMetaURL(){ return import.meta.url; }
}
