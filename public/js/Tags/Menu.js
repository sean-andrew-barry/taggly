import {Tag} from "/js/Tag.js";

export class Menu extends Tag
{
  static GetLocalName(){ return "menu"; }
  static GetMetaURL(){ return import.meta.url; }
}
