import {Event} from "/js/Event.js";

export class UnhandledRejection extends Event
{
	static GetLocalName(){ return "unhandledrejection"; }
	static GetMetaURL(){ return import.meta.url; }
}