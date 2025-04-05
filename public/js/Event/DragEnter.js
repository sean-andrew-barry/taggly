import {Event} from "/js/Event.js";

export class DragEnter extends Event
{
	static GetLocalName(){ return "dragenter"; }
	static GetMetaURL(){ return import.meta.url; }
}