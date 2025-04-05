import {Tag} from "/js/Tag.js";

export class Address extends Tag
{
  static GetMetaURL(){ return import.meta.url; }
  static GetLocalName(){ return "address"; }
}
