import {Event} from "/js/Event.js";

export class Moved extends Event
{
  static GetLocalName(){ return "Moved"; }
  static GetMetaURL(){ return import.meta.url; }
}
