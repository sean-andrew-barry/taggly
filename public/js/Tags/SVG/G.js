import {Tag} from "/js/Tag.js";
import {SVG} from "/js/Tags/SVG.js";

export class G extends SVG
{
  static GetLocalName(){ return "g"; }
  static GetMetaURL(){ return import.meta.url; }
}
