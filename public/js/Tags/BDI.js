import {Tag} from "/js/Tag.js";

export class BDI extends Tag
{
  static GetLocalName(){ return "bdi"; }
  static GetMetaURL(){ return import.meta.url; }
}
