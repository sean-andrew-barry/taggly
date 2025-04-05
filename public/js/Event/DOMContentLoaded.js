import {Event} from "/js/Event.js";

export class DOMContentLoaded extends Event
{
  static GetLocalName(){ return "DOMContentLoaded"; }
  static GetMetaURL(){ return import.meta.url; }
}
