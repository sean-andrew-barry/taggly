import {Event} from "/js/Event.js";

export class Resize extends Event
{
  static GetLocalName(){ return "Resize"; }
  static GetMetaURL(){ return import.meta.url; }
}
