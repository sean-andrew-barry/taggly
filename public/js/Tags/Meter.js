import {Tag} from "/js/Tag.js";

export class Meter extends Tag
{
  static GetLocalName(){ return "meter"; }
  static GetMetaURL(){ return import.meta.url; }
}
