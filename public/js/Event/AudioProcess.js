import {Event} from "/js/Event.js";

export class AudioProcess extends Event
{
	static GetLocalName(){ return "audioprocess"; }
	static GetMetaURL(){ return import.meta.url; }
}