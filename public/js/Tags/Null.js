import {Tag} from "/js/Tag.js";

export class Null extends Tag
{
  static GetLocalName(){ return "null"; }
  static GetMetaURL(){ return import.meta.url; }

  Deconvert(){ return null; }
}
