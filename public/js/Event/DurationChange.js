import {Event} from "/js/Event.js";

export class DurationChange extends Event
{
	static GetLocalName(){ return "durationchange"; }
	static GetMetaURL(){ return import.meta.url; }
}