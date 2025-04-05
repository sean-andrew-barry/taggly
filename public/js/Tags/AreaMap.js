import {Tag} from "/js/Tag.js";

export class AreaMap extends Tag
{
  static GetLocalName(){ return "map"; }
  static GetMetaURL(){ return import.meta.url; }
}
