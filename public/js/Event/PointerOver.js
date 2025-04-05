import {Event} from "/js/Event.js";

export class PointerOver extends Event
{
	static GetLocalName(){ return "pointerover"; }
	static GetMetaURL(){ return import.meta.url; }
}