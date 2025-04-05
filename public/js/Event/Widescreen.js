import {Event} from "/js/Event.js";

export class Widescreen extends Event
{
  static GetLocalName(){ return "Widescreen"; }
  static GetMetaURL(){ return import.meta.url; }
  static GetWidth(){ return 1216; }
}
