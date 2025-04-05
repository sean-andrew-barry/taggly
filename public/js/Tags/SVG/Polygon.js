import {Tag} from "/js/Tag.js";
import {SVG} from "/js/Tags/SVG.js";

export class Polygon extends SVG
{
  static GetLocalName(){ return "polygon"; }
  static GetMetaURL(){ return import.meta.url; }
}
