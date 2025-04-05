import {Tag} from "/js/Tag.js";

export class Header extends Tag
{
  static GetMetaURL(){ return import.meta.url; }
  static GetLocalName(){ return "header"; }
}
