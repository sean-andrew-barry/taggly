import {Tag} from "/js/Tag.js";
import {SVG} from "/js/Tags/SVG.js";

export class Rect extends SVG
{
  static GetLocalName(){ return "rect"; }
  static GetMetaURL(){ return import.meta.url; }
}
