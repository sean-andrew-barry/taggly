import {Event} from "/js/Event.js";

export class Touch extends Event
{
  static GetLocalName(){ return "touch"; }
  static GetMetaURL(){ return import.meta.url; }
}
