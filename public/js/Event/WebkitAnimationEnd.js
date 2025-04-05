import {Event} from "/js/Event.js";

export class WebkitAnimationEnd extends Event
{
	static GetLocalName(){ return "webkitanimationend"; }
	static GetMetaURL(){ return import.meta.url; }
}