import {Tag} from "/js/Tag.js";

export class Audio extends Tag
{
  static GetLocalName(){ return "audio"; }
  static GetMetaURL(){ return import.meta.url; }
}
