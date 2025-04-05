import {Tag} from "/js/Tag.js";

export class Mark extends Tag
{
  static GetLocalName(){ return "mark"; }
  static GetMetaURL(){ return import.meta.url; }
}
