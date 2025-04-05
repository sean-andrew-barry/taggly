import {Tag} from "/js/Tag.js";

export class Abbr extends Tag
{
  static GetLocalName(){ return "abbr"; }
  static GetMetaURL(){ return import.meta.url; }
}
