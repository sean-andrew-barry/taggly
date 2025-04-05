import {Event} from "/js/Event.js";

export class Emptied extends Event
{
	static GetLocalName(){ return "emptied"; }
	static GetMetaURL(){ return import.meta.url; }
}