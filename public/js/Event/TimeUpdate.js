import {Event} from "/js/Event.js";

export class TimeUpdate extends Event
{
	static GetLocalName(){ return "timeupdate"; }
	static GetMetaURL(){ return import.meta.url; }
}