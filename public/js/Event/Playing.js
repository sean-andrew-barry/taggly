import {Event} from "/js/Event.js";

export class Playing extends Event
{
	static GetLocalName(){ return "playing"; }
	static GetMetaURL(){ return import.meta.url; }
}