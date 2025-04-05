import {Event} from "/js/Event.js";

export class ViewEnter extends Event
{
  static GetLocalName(){ return "ViewEnter"; }
  static GetMetaURL(){ return import.meta.url; }
}
