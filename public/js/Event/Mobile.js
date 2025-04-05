import {Event} from "/js/Event.js";

export class Mobile extends Event
{
  static GetLocalName(){ return "Mobile"; }
  static GetMetaURL(){ return import.meta.url; }
  static GetWidth(){ return 768; }
}
