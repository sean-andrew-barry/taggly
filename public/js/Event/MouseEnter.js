import {Event} from "/js/Event.js";

export class MouseEnter extends Event
{
	static GetLocalName(){ return "mouseenter"; }
	static GetMetaURL(){ return import.meta.url; }
}