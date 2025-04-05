import {Event} from "/js/Event.js";

export class SocketClose extends Event
{
	static GetLocalName(){ return "close"; }
	static GetMetaURL(){ return import.meta.url; }
}