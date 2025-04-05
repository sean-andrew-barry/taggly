import {Event} from "/js/Event.js";

export class Paste extends Event
{
	static GetLocalName(){ return "paste"; }
	static GetMetaURL(){ return import.meta.url; }
}