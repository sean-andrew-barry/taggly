import {Tag} from "/js/Tag.js";

export class Picture extends Tag
{
  static GetLocalName(){ return "picture"; }
  static GetMetaURL(){ return import.meta.url; }
}
