import {Event} from "/js/Event.js";

export class Copy extends Event
{
	static GetLocalName(){ return "copy"; }
	static GetMetaURL(){ return import.meta.url; }
}