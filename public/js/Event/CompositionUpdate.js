import {Event} from "/js/Event.js";

export class CompositionUpdate extends Event
{
	static GetLocalName(){ return "compositionupdate"; }
	static GetMetaURL(){ return import.meta.url; }
}