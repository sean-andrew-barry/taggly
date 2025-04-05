import {Tag} from "/js/Tag.js";

export class OL extends Tag
{
  static GetLocalName(){ return "ol"; }
  static GetMetaURL(){ return import.meta.url; }
}
