import {Event} from "/js/Event.js";

export class PointerOut extends Event
{
	static GetLocalName(){ return "pointerout"; }
	static GetMetaURL(){ return import.meta.url; }
}