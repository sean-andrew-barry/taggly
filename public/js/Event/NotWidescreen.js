import {Event} from "/js/Event.js";

export class NotWidescreen extends Event
{
  static GetLocalName(){ return "NotWidescreen"; }
  static GetMetaURL(){ return import.meta.url; }
  static GetWidth(){ return 1216; }
}
