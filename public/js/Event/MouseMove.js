import {Event} from "/js/Event.js";

export class MouseMove extends Event
{
	static GetLocalName(){ return "mousemove"; }
	static GetMetaURL(){ return import.meta.url; }
}