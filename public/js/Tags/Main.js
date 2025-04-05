import {Tag} from "/js/Tag.js";

export class Main extends Tag
{
  static GetLocalName(){ return "main"; }
  static GetMetaURL(){ return import.meta.url; }
}
