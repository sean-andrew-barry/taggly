import {Event} from "/js/Event.js";

export class DragOver extends Event
{
	static GetLocalName(){ return "dragover"; }
	static GetMetaURL(){ return import.meta.url; }
}