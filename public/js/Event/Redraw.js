import {Event} from "/js/Event.js";

export class Redraw extends Event
{
  static GetLocalName(){ return "Redraw"; }
  static GetMetaURL(){ return import.meta.url; }
}
