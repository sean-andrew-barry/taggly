import {Tag} from "/js/Tag.js";

export class Time extends Tag
{
  static GetLocalName(){ return "time"; }
  static GetMetaURL(){ return import.meta.url; }
}
