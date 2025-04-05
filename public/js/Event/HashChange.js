import {Event} from "/js/Event.js";

export class HashChange extends Event
{
	static GetLocalName(){ return "hashchange"; }
	static GetMetaURL(){ return import.meta.url; }
}