import {Event} from "/js/Event.js";

export class CueChange extends Event
{
	static GetLocalName(){ return "cuechange"; }
	static GetMetaURL(){ return import.meta.url; }
}