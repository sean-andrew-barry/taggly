import {Event} from "/js/Event.js";

export class FullViewEnter extends Event
{
  static GetLocalName(){ return "FullViewEnter"; }
  static GetMetaURL(){ return import.meta.url; }
}
