import {Tag} from "/js/Tag.js";

export class Caption extends Tag
{
  static GetLocalName(){ return "caption"; }
  static GetMetaURL(){ return import.meta.url; }
}
