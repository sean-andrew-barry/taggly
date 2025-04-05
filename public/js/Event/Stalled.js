import {Event} from "/js/Event.js";

export class Stalled extends Event
{
	static GetLocalName(){ return "stalled"; }
	static GetMetaURL(){ return import.meta.url; }
}