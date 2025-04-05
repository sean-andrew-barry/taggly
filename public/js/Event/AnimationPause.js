import {Event} from "/js/Event.js";

export class AnimationPause extends Event
{
  static GetMetaURL(){ return import.meta.url; }
  static GetLocalName(){ return "AnimationPause"; }
}
