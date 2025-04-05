import {Event} from "/js/Event.js";

export class Render extends Event
{
  static GetLocalName(){ return "Render"; }
  static GetMetaURL(){ return import.meta.url; }
}
