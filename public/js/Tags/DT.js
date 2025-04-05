import {Tag} from "/js/Tag.js";

export class DT extends Tag
{
  static GetLocalName(){ return "dt"; }
  static GetMetaURL(){ return import.meta.url; }
}
