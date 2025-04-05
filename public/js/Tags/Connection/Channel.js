import {Tag} from "/js/Tag.js";

export class Channel extends Tag
{
  static GetMetaURL(){ return import.meta.url; }
  static GetLocalName(){ return "channel"; }

  Write(data)
  {
  }
}
