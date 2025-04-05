import {Tag} from "/js/Tag.js";

export class RT extends Tag
{
  static GetLocalName(){ return "rt"; }
  static GetMetaURL(){ return import.meta.url; }
}
