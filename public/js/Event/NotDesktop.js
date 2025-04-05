import {Event} from "/js/Event.js";

export class NotDesktop extends Event
{
  static GetLocalName(){ return "NotDesktop"; }
  static GetMetaURL(){ return import.meta.url; }
  static GetWidth(){ return 1024; }
}
