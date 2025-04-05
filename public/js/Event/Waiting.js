import {Event} from "/js/Event.js";

export class Waiting extends Event
{
	static GetLocalName(){ return "waiting"; }
	static GetMetaURL(){ return import.meta.url; }
}