import {Event} from "/js/Event.js";

export class Drop extends Event
{
	static GetLocalName(){ return "drop"; }
	static GetMetaURL(){ return import.meta.url; }
}