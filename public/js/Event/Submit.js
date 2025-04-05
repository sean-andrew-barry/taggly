import {Event} from "/js/Event.js";

export class Submit extends Event
{
  static GetLocalName(){ return "submit"; }
  static GetMetaURL(){ return import.meta.url; }
}
