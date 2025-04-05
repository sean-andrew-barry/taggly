import {Event} from "/js/Event.js";

export class AuxClick extends Event
{
	static GetLocalName(){ return "auxclick"; }
	static GetMetaURL(){ return import.meta.url; }
}