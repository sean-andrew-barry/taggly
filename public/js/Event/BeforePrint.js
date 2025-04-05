import {Event} from "/js/Event.js";

export class BeforePrint extends Event
{
	static GetLocalName(){ return "beforeprint"; }
	static GetMetaURL(){ return import.meta.url; }
}