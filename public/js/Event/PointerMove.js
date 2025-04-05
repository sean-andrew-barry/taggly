import {Event} from "/js/Event.js";

export class PointerMove extends Event
{
	static GetLocalName(){ return "pointermove"; }
	static GetMetaURL(){ return import.meta.url; }
}