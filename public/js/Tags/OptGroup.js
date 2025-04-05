import {Tag} from "/js/Tag.js";

export class OptGroup extends Tag
{
  static GetLocalName(){ return "optgroup"; }
  static GetMetaURL(){ return import.meta.url; }
}
