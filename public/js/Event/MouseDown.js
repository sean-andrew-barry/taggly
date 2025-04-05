import {Event} from "/js/Event.js";

export class MouseDown extends Event
{
	static GetLocalName(){ return "mousedown"; }
	static GetMetaURL(){ return import.meta.url; }
}