import {Event} from "/js/Event.js";

export class FullViewLeave extends Event
{
  static GetLocalName(){ return "FullViewLeave"; }
  static GetMetaURL(){ return import.meta.url; }
}
