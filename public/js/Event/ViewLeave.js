import {Event} from "/js/Event.js";

export class ViewLeave extends Event
{
  static GetLocalName(){ return "ViewLeave"; }
  static GetMetaURL(){ return import.meta.url; }
}
