import {Tag} from "/js/Tag.js";
import {SVG} from "/js/Tags/SVG.js";

export class LinearGradient extends SVG
{
  static GetLocalName(){ return "linearGradient"; }
  static GetMetaURL(){ return import.meta.url; }
}
