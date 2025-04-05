import {Event} from "/js/Event.js";

export class Play extends Event
{
	static GetLocalName(){ return "play"; }
	static GetMetaURL(){ return import.meta.url; }
}