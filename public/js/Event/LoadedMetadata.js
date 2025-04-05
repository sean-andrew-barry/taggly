import {Event} from "/js/Event.js";

export class LoadedMetadata extends Event
{
	static GetLocalName(){ return "loadedmetadata"; }
	static GetMetaURL(){ return import.meta.url; }
}