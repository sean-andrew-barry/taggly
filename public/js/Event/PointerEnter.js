import {Event} from "/js/Event.js";

export class PointerEnter extends Event
{
	static GetLocalName(){ return "pointerenter"; }
	static GetMetaURL(){ return import.meta.url; }
}