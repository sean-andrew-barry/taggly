import {Event} from "/js/Event.js";

export class Seeking extends Event
{
	static GetLocalName(){ return "seeking"; }
	static GetMetaURL(){ return import.meta.url; }
}