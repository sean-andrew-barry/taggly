import {Event} from "/js/Event.js";

export class Desktop extends Event
{
  static GetLocalName(){ return "Desktop"; }
  static GetMetaURL(){ return import.meta.url; }
  static GetWidth(){ return 1024; }
}
