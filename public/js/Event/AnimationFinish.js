import {Event} from "/js/Event.js";

export class AnimationFinish extends Event
{
  static GetMetaURL(){ return import.meta.url; }
  static GetLocalName(){ return "AnimationFinish"; }
}
