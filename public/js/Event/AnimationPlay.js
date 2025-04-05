import {Event} from "/js/Event.js";

export class AnimationPlay extends Event
{
  static GetMetaURL(){ return import.meta.url; }
  static GetLocalName(){ return "AnimationPlay"; }
}
