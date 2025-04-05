import {Tag} from "/js/Tag.js";

export class Article extends Tag
{
  static GetMetaURL(){ return import.meta.url; }
  static GetLocalName(){ return "article"; }
}
