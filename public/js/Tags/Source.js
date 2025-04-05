import {Tag} from "/js/Tag.js";

export class Source extends Tag
{
  static GetLocalName(){ return "source"; }
  static GetMetaURL(){ return import.meta.url; }
}
