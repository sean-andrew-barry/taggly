import {Event} from "/js/Event.js";

export class Input extends Event
{
  static GetLocalName(){ return "input"; }
  static GetMetaURL(){ return import.meta.url; }
}
