import {Tag} from "/js/Tag.js";

export class DataList extends Tag
{
  static GetLocalName(){ return "datalist"; }
  static GetMetaURL(){ return import.meta.url; }
}
