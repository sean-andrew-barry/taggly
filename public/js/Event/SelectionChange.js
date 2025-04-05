import {Event} from "/js/Event.js";

export class SelectionChange extends Event
{
	static GetLocalName(){ return "selectionchange"; }
	static GetMetaURL(){ return import.meta.url; }
}