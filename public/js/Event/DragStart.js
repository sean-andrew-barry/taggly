import {Event} from "/js/Event.js";

export class DragStart extends Event
{
	static GetLocalName(){ return "dragstart"; }
	static GetMetaURL(){ return import.meta.url; }
}