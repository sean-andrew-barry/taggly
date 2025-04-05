import {Tag} from "/js/Tag.js";

export class Bundler extends Tag
{
  static GetLocalName(){ return "bundler"; }
  static GetMetaURL(){ return import.meta.url; }
}
