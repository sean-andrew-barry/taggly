import {Event} from "/js/Event.js";

export class MouseWheel extends Event
{
	static GetLocalName(){ return "mousewheel"; }
	static GetMetaURL(){ return import.meta.url; }
}