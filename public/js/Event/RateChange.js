import {Event} from "/js/Event.js";

export class RateChange extends Event
{
	static GetLocalName(){ return "ratechange"; }
	static GetMetaURL(){ return import.meta.url; }
}