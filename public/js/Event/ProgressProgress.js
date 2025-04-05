import {Event} from "/js/Event.js";

export class ProgressProgress extends Event
{
	static GetLocalName(){ return "progress"; }
	static GetMetaURL(){ return import.meta.url; }
}