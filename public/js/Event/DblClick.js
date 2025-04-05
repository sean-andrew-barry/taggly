import {Event} from "/js/Event.js";

export class DblClick extends Event
{
	static GetLocalName(){ return "dblclick"; }
	static GetMetaURL(){ return import.meta.url; }
}