import {Event} from "/js/Event.js";

export class AnimationCancel extends Event
{
  static GetMetaURL(){ return import.meta.url; }
  static GetLocalName(){ return "AnimationCancel"; }
}
