import {Tag} from "/js/Tag.js";

export class Button extends Tag
{
  static GetMetaURL(){ return import.meta.url; }
  static GetLocalName(){ return "button"; }
}

export {Button as BUTTON};
