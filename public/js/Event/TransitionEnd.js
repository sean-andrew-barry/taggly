import {Event} from "/js/Event.js";

export class TransitionEnd extends Event
{
  static GetMetaURL(){ return import.meta.url; }
  static GetLocalName(){ return "transitionend"; }
}
