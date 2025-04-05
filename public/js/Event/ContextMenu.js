import {Event} from "/js/Event.js";

export class ContextMenu extends Event
{
	static GetLocalName(){ return "contextmenu"; }
	static GetMetaURL(){ return import.meta.url; }
}