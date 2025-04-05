import {Event} from "/js/Event.js";

export class ProgressLoadEnd extends Event
{
	static GetLocalName(){ return "loadend"; }
	static GetMetaURL(){ return import.meta.url; }
}