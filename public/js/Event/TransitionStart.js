import {Event} from "/js/Event.js";

export class TransitionStart extends Event
{
  static GetMetaURL(){ return import.meta.url; }
  static GetLocalName(){ return "transitionstart"; }
}
