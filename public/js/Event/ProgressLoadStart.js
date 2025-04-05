import {Event} from "/js/Event.js";

export class ProgressLoadStart extends Event
{
	static GetLocalName(){ return "loadstart"; }
	static GetMetaURL(){ return import.meta.url; }
}