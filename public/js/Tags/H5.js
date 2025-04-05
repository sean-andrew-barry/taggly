import {Tag} from "/js/Tag.js";

export class H5 extends Tag
{
  static GetLocalName(){ return "h5"; }
  static GetMetaURL(){ return import.meta.url; }
}
