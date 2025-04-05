import {Event} from "/js/Event.js";

export class KeyUp extends Event
{
	static GetLocalName(){ return "keyup"; }
	static GetMetaURL(){ return import.meta.url; }
}