import {Event} from "/js/Event.js";

export class MessageError extends Event
{
	static GetLocalName(){ return "messageerror"; }
	static GetMetaURL(){ return import.meta.url; }
}