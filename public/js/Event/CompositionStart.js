import {Event} from "/js/Event.js";

export class CompositionStart extends Event
{
	static GetLocalName(){ return "compositionstart"; }
	static GetMetaURL(){ return import.meta.url; }
}