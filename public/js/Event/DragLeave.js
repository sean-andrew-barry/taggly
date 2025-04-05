import {Event} from "/js/Event.js";

export class DragLeave extends Event
{
	static GetLocalName(){ return "dragleave"; }
	static GetMetaURL(){ return import.meta.url; }
}