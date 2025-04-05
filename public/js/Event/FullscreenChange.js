import {Event} from "/js/Event.js";

export class FullscreenChange extends Event
{
	static GetLocalName(){ return "fullscreenchange"; }
	static GetMetaURL(){ return import.meta.url; }
}