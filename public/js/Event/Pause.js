import {Event} from "/js/Event.js";

export class Pause extends Event
{
	static GetLocalName(){ return "pause"; }
	static GetMetaURL(){ return import.meta.url; }
}