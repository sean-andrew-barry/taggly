import {Event} from "/js/Event.js";

export class RejectionHandled extends Event
{
	static GetLocalName(){ return "rejectionhandled"; }
	static GetMetaURL(){ return import.meta.url; }
}