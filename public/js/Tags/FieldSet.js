import {Tag} from "/js/Tag.js";

export class FieldSet extends Tag
{
  static GetLocalName(){ return "fieldset"; }
  static GetMetaURL(){ return import.meta.url; }
}
