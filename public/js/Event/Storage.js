import {Event} from "/js/Event.js";

export class Storage extends Event
{
	static GetLocalName(){ return "storage"; }
	static GetMetaURL(){ return import.meta.url; }
}