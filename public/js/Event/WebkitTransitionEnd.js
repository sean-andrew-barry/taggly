import {Event} from "/js/Event.js";

export class WebkitTransitionEnd extends Event
{
	static GetLocalName(){ return "webkittransitionend"; }
	static GetMetaURL(){ return import.meta.url; }
}