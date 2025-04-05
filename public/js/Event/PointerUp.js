import {Event} from "/js/Event.js";

export class PointerUp extends Event
{
	static GetLocalName(){ return "pointerup"; }
	static GetMetaURL(){ return import.meta.url; }
}