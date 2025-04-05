import {Event} from "/js/Event.js";

export class Disconnect extends Event
{
  static GetLocalName(){ return "Disconnect"; }
  static GetMetaURL(){ return import.meta.url; }
}
