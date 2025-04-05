import {Event} from "/js/Event.js";

export class Mutation extends Event
{
  static GetLocalName(){ return "Mutation"; }
  static GetMetaURL(){ return import.meta.url; }
}
