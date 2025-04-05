import {Event} from "/js/Event.js";

export class Blur extends Event
{
	static GetLocalName(){ return "blur"; }
	static GetMetaURL(){ return import.meta.url; }
}