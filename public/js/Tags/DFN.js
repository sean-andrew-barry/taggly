import {Tag} from "/js/Tag.js";

export class DFN extends Tag
{
  static GetMetaURL(){ return import.meta.url; }
  static GetLocalName(){ return "dfn"; }
}
