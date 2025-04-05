import {Event} from "/js/Event.js";

export class PointerDown extends Event
{
	static GetLocalName(){ return "pointerdown"; }
	static GetMetaURL(){ return import.meta.url; }
}