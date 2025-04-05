import {Event} from "/js/Event.js";

export class AfterPrint extends Event
{
	static GetLocalName(){ return "afterprint"; }
	static GetMetaURL(){ return import.meta.url; }
}