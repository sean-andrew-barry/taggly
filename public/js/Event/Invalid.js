import {Event} from "/js/Event.js";

export class Invalid extends Event
{
	static GetLocalName(){ return "invalid"; }
	static GetMetaURL(){ return import.meta.url; }
}