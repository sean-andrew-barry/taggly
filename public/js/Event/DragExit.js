import {Event} from "/js/Event.js";

export class DragExit extends Event
{
	static GetLocalName(){ return "dragexit"; }
	static GetMetaURL(){ return import.meta.url; }
}