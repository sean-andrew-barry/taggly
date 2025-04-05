import {Event} from "/js/Event.js";

export class Ended extends Event
{
	static GetLocalName(){ return "ended"; }
	static GetMetaURL(){ return import.meta.url; }
}