import {Event} from "/js/Event.js";

export class TransitionRun extends Event
{
  static GetMetaURL(){ return import.meta.url; }
  static GetLocalName(){ return "transitionrun"; }
}
