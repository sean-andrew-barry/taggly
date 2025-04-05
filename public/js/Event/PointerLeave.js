import {Event} from "/js/Event.js";

export class PointerLeave extends Event
{
	static GetLocalName(){ return "pointerleave"; }
	static GetMetaURL(){ return import.meta.url; }
}