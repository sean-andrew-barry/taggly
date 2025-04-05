import {Event} from "/js/Event.js";

export class Cut extends Event
{
	static GetLocalName(){ return "cut"; }
	static GetMetaURL(){ return import.meta.url; }
}