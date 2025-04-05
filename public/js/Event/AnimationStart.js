import {Event} from "/js/Event.js";

export class AnimationStart extends Event
{
  static GetMetaURL(){ return import.meta.url; }
  static GetLocalName(){ return "animationstart"; }
}
