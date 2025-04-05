import {Event} from "/js/Event.js";

export class Complete extends Event
{
	static GetLocalName(){ return "complete"; }
	static GetMetaURL(){ return import.meta.url; }
}
