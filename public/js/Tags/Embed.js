import {Tag} from "/js/Tag.js";

export class Embed extends Tag
{
  static GetLocalName(){ return "embed"; }
  static GetMetaURL(){ return import.meta.url; }
}
