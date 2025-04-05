import {Event} from "/js/Event.js";

export class SelectStart extends Event
{
	static GetLocalName(){ return "selectstart"; }
	static GetMetaURL(){ return import.meta.url; }
}