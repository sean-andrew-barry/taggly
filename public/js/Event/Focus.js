import {Event} from "/js/Event.js";

export class Focus extends Event
{
	static GetLocalName(){ return "focus"; }
	static GetMetaURL(){ return import.meta.url; }
}