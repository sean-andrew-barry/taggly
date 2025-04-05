import {Tag} from "/js/Tag.js";

export class Map extends Tag
{
  static GetLocalName(){ return "map"; }
  static GetMetaURL(){ return import.meta.url; }
}
