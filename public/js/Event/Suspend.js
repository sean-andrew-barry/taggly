import {Event} from "/js/Event.js";

export class Suspend extends Event
{
	static GetLocalName(){ return "suspend"; }
	static GetMetaURL(){ return import.meta.url; }
}