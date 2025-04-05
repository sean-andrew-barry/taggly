import {Event} from "/js/Event.js";

export class Click extends Event
{
  static GetLocalName(){ return "click"; }
  static GetMetaURL(){ return import.meta.url; }
}
