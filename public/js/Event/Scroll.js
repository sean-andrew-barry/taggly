import {Event} from "/js/Event.js";

export class Scroll extends Event
{
	static GetLocalName(){ return "scroll"; }
	static GetMetaURL(){ return import.meta.url; }
}