import {Event} from "/js/Event.js";

export class KeyPress extends Event
{
	static GetLocalName(){ return "keypress"; }
	static GetMetaURL(){ return import.meta.url; }
}