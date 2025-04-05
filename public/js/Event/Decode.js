import {Event} from "/js/Event.js";

export class Decode extends Event
{
  static GetMetaURL(){ return import.meta.url; }
  static GetLocalName(){ return "Decode"; }
}
