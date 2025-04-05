import {Tag} from "/js/Tag.js";
import {SVG} from "/js/Tags/SVG.js";

export class Stop extends SVG
{
  static GetLocalName(){ return "stop"; }
  static GetMetaURL(){ return import.meta.url; }
}
