import {Event} from "/js/Event.js";

export class WebkitAnimationStart extends Event
{
	static GetLocalName(){ return "webkitanimationstart"; }
	static GetMetaURL(){ return import.meta.url; }
}