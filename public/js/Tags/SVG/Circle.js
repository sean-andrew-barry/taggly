import {Tag} from "/js/Tag.js";
import {SVG} from "/js/Tags/SVG.js";

export class Circle extends SVG
{
  static GetLocalName(){ return "circle"; }
  static GetMetaURL(){ return import.meta.url; }
}
