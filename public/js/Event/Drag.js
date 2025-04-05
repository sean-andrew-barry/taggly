import {Event} from "/js/Event.js";

export class Drag extends Event
{
	static GetLocalName(){ return "drag"; }
	static GetMetaURL(){ return import.meta.url; }
}