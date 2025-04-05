import {Tag} from "/js/Tag.js";

export class KeyGen extends Tag
{
  static GetLocalName(){ return "keygen"; }
  static GetMetaURL(){ return import.meta.url; }
}
