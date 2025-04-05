import {Event} from "/js/Event.js";

export class LoadedData extends Event
{
	static GetLocalName(){ return "loadeddata"; }
	static GetMetaURL(){ return import.meta.url; }
}