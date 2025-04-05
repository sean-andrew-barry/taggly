import {Tag} from "/js/Tag.js";
import {SVG} from "/js/Tags/SVG.js";

export class Defs extends SVG
{
  static GetLocalName(){ return "defs"; }
  static GetMetaURL(){ return import.meta.url; }
}
