import {Event} from "/js/Event.js";

export class Cancel extends Event
{
	static GetLocalName(){ return "cancel"; }
	static GetMetaURL(){ return import.meta.url; }
}