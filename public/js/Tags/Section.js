import {Tag} from "/js/Tag.js";

export class Section extends Tag
{
  static GetLocalName(){ return "section"; }
  static GetMetaURL(){ return import.meta.url; }
}
