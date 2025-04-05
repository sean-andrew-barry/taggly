import {Event} from "/js/Event.js";

export class Wheel extends Event
{
	static GetLocalName(){ return "wheel"; }
	static GetMetaURL(){ return import.meta.url; }
}