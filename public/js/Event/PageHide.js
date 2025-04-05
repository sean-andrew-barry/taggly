import {Event} from "/js/Event.js";

export class PageHide extends Event
{
	static GetLocalName(){ return "pagehide"; }
	static GetMetaURL(){ return import.meta.url; }
}