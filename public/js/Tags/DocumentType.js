import {Tag} from "/js/Tag.js";

export class DocumentType extends Tag
{
  static GetLocalName(){ return "html"; }
  static GetMetaURL(){ return import.meta.url; }
}
