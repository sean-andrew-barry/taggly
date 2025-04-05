import {Event} from "/js/Event.js";

export class AutoCompleteError extends Event
{
	static GetLocalName(){ return "autocompleteerror"; }
	static GetMetaURL(){ return import.meta.url; }
}