import {Event} from "/js/Event.js";

export class PointerLockChange extends Event
{
	static GetLocalName(){ return "pointerlockchange"; }
	static GetMetaURL(){ return import.meta.url; }
}