import {Tag} from "/js/Tag.js";

export class Figure extends Tag
{
  static GetLocalName(){ return "figure"; }
  static GetMetaURL(){ return import.meta.url; }
}
