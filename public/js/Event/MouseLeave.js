import {Event} from "/js/Event.js";

export class MouseLeave extends Event
{
	static GetLocalName(){ return "mouseleave"; }
	static GetMetaURL(){ return import.meta.url; }
}