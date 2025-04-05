import {Event} from "/js/Event.js";

export class Search extends Event
{
	static GetLocalName(){ return "search"; }
	static GetMetaURL(){ return import.meta.url; }
}