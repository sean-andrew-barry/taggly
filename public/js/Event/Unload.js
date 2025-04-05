import {Event} from "/js/Event.js";

export class Unload extends Event
{
	static GetLocalName(){ return "unload"; }
	static GetMetaURL(){ return import.meta.url; }
}