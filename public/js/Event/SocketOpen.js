import {Event} from "/js/Event.js";

export class SocketOpen extends Event
{
	static GetLocalName(){ return "open"; }
	static GetMetaURL(){ return import.meta.url; }
}