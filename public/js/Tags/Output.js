import {Tag} from "/js/Tag.js";

export class Output extends Tag
{
  static GetLocalName(){ return "output"; }
  static GetMetaURL(){ return import.meta.url; }
}
