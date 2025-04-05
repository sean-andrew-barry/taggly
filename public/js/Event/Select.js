import {Event} from "/js/Event.js";

export class Select extends Event
{
	static GetLocalName(){ return "select"; }
	static GetMetaURL(){ return import.meta.url; }
}
