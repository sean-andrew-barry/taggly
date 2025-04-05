import {Event} from "/js/Event.js";

export class Offline extends Event
{
	static GetLocalName(){ return "offline"; }
	static GetMetaURL(){ return import.meta.url; }
}