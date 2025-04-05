import {Tag} from "/js/Tag.js";

export class ColGroup extends Tag
{
  static GetLocalName(){ return "colgroup"; }
  static GetMetaURL(){ return import.meta.url; }
}
