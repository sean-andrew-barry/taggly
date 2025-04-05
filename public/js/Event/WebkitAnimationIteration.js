import {Event} from "/js/Event.js";

export class WebkitAnimationIteration extends Event
{
	static GetLocalName(){ return "webkitanimationiteration"; }
	static GetMetaURL(){ return import.meta.url; }
}