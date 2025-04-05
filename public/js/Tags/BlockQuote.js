import {Tag} from "/js/Tag.js";

export class BlockQuote extends Tag
{
  static GetMetaURL(){ return import.meta.url; }
  static GetLocalName(){ return "blockquote"; }
}
