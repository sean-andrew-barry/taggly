import {Tag} from "/js/Tag.js";

export class Var extends Tag
{
  static GetLocalName(){ return "var"; }
  static GetMetaURL(){ return import.meta.url; }
}
