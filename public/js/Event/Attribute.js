import {Event} from "/js/Event.js";

export class Attribute extends Event
{
  static GetLocalName(){ return "Attribute"; }
  static GetMetaURL(){ return import.meta.url; }
}
