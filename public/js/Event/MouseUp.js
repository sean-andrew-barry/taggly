import {Event} from "/js/Event.js";

export class MouseUp extends Event
{
	static GetLocalName(){ return "mouseup"; }
	static GetMetaURL(){ return import.meta.url; }
}