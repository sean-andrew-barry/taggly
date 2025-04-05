import {Event} from "/js/Event.js";

export class NotTablet extends Event
{
  static GetLocalName(){ return "NotTablet"; }
  static GetMetaURL(){ return import.meta.url; }
  static GetWidth(){ return 768; }
}
