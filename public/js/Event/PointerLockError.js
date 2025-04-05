import {Event} from "/js/Event.js";

export class PointerLockError extends Event
{
	static GetLocalName(){ return "pointerlockerror"; }
	static GetMetaURL(){ return import.meta.url; }
}