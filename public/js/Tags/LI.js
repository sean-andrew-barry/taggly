import {Tag} from "/js/Tag.js";

export class LI extends Tag
{
  static GetLocalName(){ return "li"; }
  static GetMetaURL(){ return import.meta.url; }
}
