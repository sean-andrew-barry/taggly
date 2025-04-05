import {Event} from "/js/Event.js";

export class NotFullHD extends Event
{
  static GetLocalName(){ return "NotFullHD"; }
  static GetMetaURL(){ return import.meta.url; }
  static GetWidth(){ return 1408; }
}
