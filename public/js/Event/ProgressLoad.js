import {Event} from "/js/Event.js";

export class ProgressLoad extends Event
{
	static GetLocalName(){ return "load"; }
	static GetMetaURL(){ return import.meta.url; }
}