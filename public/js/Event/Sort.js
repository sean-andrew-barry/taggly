import {Event} from "/js/Event.js";

export class Sort extends Event
{
	static GetLocalName(){ return "sort"; }
	static GetMetaURL(){ return import.meta.url; }
}