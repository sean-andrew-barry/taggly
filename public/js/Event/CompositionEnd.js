import {Event} from "/js/Event.js";

export class CompositionEnd extends Event
{
	static GetLocalName(){ return "compositionend"; }
	static GetMetaURL(){ return import.meta.url; }
}