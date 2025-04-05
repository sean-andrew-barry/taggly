import {Tag} from "/js/Tag.js";

export class Small extends Tag
{
  static GetLocalName(){ return "small"; }
  static GetMetaURL(){ return import.meta.url; }
}
