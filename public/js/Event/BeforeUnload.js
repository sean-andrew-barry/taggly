import {Event} from "/js/Event.js";

export class BeforeUnload extends Event
{
	static GetLocalName(){ return "beforeunload"; }
	static GetMetaURL(){ return import.meta.url; }
}