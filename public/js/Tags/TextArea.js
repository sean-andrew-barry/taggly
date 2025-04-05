import {Tag} from "/js/Tag.js";

export class TextArea extends Tag
{
  static GetLocalName(){ return "textarea"; }
  static GetMetaURL(){ return import.meta.url; }
}
