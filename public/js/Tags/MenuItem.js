import {Tag} from "/js/Tag.js";

export class MenuItem extends Tag
{
  static GetLocalName(){ return "menuitem"; }
  static GetMetaURL(){ return import.meta.url; }
}
