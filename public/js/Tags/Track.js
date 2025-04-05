import {Tag} from "/js/Tag.js";

export class Track extends Tag
{
  static GetLocalName(){ return "track"; }
  static GetMetaURL(){ return import.meta.url; }
}
