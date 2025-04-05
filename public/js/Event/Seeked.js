import {Event} from "/js/Event.js";

export class Seeked extends Event
{
	static GetLocalName(){ return "seeked"; }
	static GetMetaURL(){ return import.meta.url; }
}