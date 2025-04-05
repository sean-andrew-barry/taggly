import {Event} from "/js/Event.js";

export class NotMobile extends Event
{
  static GetLocalName(){ return "NotMobile"; }
  static GetMetaURL(){ return import.meta.url; }
  static GetWidth(){ return 768; }
}
