import {Event} from "/js/Event.js";

export class DragEnd extends Event
{
	static GetLocalName(){ return "dragend"; }
	static GetMetaURL(){ return import.meta.url; }
}