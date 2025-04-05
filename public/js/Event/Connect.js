import {Event} from "/js/Event.js";

export class Connect extends Event
{
  static GetLocalName(){ return "Connect"; }
  static GetMetaURL(){ return import.meta.url; }
}
