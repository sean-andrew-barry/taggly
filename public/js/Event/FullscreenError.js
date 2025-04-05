import {Event} from "/js/Event.js";

export class FullscreenError extends Event
{
	static GetLocalName(){ return "fullscreenerror"; }
	static GetMetaURL(){ return import.meta.url; }
}