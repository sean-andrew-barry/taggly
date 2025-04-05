import {Event} from "/js/Event.js";

export class Toggle extends Event
{
	static GetLocalName(){ return "toggle"; }
	static GetMetaURL(){ return import.meta.url; }
}