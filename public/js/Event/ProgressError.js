import {Event} from "/js/Event.js";

export class ProgressError extends Event
{
	static GetLocalName(){ return "error"; }
	static GetMetaURL(){ return import.meta.url; }
}