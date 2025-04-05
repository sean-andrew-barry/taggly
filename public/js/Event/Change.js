import {Event} from "/js/Event.js";

export class Change extends Event
{
	static GetLocalName(){ return "change"; }
	static GetMetaURL(){ return import.meta.url; }
}