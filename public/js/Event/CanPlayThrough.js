import {Event} from "/js/Event.js";

export class CanPlayThrough extends Event
{
	static GetLocalName(){ return "canplaythrough"; }
	static GetMetaURL(){ return import.meta.url; }
}