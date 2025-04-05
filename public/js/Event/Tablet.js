import {Event} from "/js/Event.js";

export class Tablet extends Event
{
  static GetLocalName(){ return "Tablet"; }
  static GetMetaURL(){ return import.meta.url; }
  static GetWidth(){ return 768; }
}
