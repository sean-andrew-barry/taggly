import {Event} from "/js/Event.js";

export class LostPointerCapture extends Event
{
	static GetLocalName(){ return "lostpointercapture"; }
	static GetMetaURL(){ return import.meta.url; }
}