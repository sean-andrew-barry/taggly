import {Event} from "/js/Event.js";

export class PageShow extends Event
{
	static GetLocalName(){ return "pageshow"; }
	static GetMetaURL(){ return import.meta.url; }
}