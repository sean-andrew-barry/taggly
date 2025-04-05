import {Event} from "/js/Event.js";

export class Reset extends Event
{
	static GetLocalName(){ return "reset"; }
	static GetMetaURL(){ return import.meta.url; }
}