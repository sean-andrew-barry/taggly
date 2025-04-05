import {Tag} from "/js/Tag.js";

export class Nav extends Tag
{
  static GetLocalName(){ return "nav"; }
  static GetMetaURL(){ return import.meta.url; }
}
