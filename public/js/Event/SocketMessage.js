import {Event} from "/js/Event.js";

export class SocketMessage extends Event
{
	static GetLocalName(){ return "message"; }
	static GetMetaURL(){ return import.meta.url; }
}