import {Tag} from "/js/Tag.js";

export class Video extends Tag
{
  static GetLocalName(){ return "video"; }
  static GetMetaURL(){ return import.meta.url; }
}

export {Video as VIDEO};
