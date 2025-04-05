import {Event} from "/js/Event.js";

export class CanPlay extends Event
{
	static GetLocalName(){ return "canplay"; }
	static GetMetaURL(){ return import.meta.url; }
}