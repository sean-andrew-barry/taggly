import {Tag} from "/js/Tag.js";

export class Sup extends Tag
{
  static GetLocalName(){ return "sup"; }
  static GetMetaURL(){ return import.meta.url; }
}
