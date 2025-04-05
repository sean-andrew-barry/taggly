import {Event} from "/js/Event.js";

export class Online extends Event
{
	static GetLocalName(){ return "online"; }
	static GetMetaURL(){ return import.meta.url; }
}