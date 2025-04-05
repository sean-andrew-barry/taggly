import {Event} from "/js/Event.js";

export class MouseOut extends Event
{
  static GetLocalName(){ return "mouseout"; }
  static GetMetaURL(){ return import.meta.url; }
}
