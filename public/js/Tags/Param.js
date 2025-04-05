import {Tag} from "/js/Tag.js";

export class Param extends Tag
{
  static GetLocalName(){ return "param"; }
  static GetMetaURL(){ return import.meta.url; }
}
