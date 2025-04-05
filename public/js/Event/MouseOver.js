import {Event} from "/js/Event.js";

export class MouseOver extends Event
{
  static GetLocalName(){ return "mouseover"; }
  static GetMetaURL(){ return import.meta.url; }
}
