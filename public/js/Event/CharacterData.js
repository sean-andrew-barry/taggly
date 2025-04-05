import {Event} from "/js/Event.js";

export class CharacterData extends Event
{
  static GetLocalName(){ return "CharacterData"; }
  static GetMetaURL(){ return import.meta.url; }
}
