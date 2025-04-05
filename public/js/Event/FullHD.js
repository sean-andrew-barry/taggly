import {Event} from "/js/Event.js";

export class FullHD extends Event
{
  static GetLocalName(){ return "FullHD"; }
  static GetMetaURL(){ return import.meta.url; }
  static GetWidth(){ return 1408; }
}
