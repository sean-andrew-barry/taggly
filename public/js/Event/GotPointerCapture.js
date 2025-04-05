import {Event} from "/js/Event.js";

export class GotPointerCapture extends Event
{
	static GetLocalName(){ return "gotpointercapture"; }
	static GetMetaURL(){ return import.meta.url; }
}