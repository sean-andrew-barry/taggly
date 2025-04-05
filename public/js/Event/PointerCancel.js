import {Event} from "/js/Event.js";

export class PointerCancel extends Event
{
	static GetLocalName(){ return "pointercancel"; }
	static GetMetaURL(){ return import.meta.url; }
}