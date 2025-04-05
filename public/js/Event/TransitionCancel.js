import {Event} from "/js/Event.js";

export class TransitionCancel extends Event
{
	static GetLocalName(){ return "transitioncancel"; }
	static GetMetaURL(){ return import.meta.url; }
}