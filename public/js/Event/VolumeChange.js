import {Event} from "/js/Event.js";

export class VolumeChange extends Event
{
	static GetLocalName(){ return "volumechange"; }
	static GetMetaURL(){ return import.meta.url; }
}