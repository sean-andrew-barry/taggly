import {Event} from "/js/Event.js";

export class ProgressAbort extends Event
{
	static GetLocalName(){ return "abort"; }
	static GetMetaURL(){ return import.meta.url; }
}