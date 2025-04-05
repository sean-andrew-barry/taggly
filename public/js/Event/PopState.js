import {Event} from "/js/Event.js";

export class PopState extends Event
{
	static GetLocalName(){ return "popstate"; }
	static GetMetaURL(){ return import.meta.url; }
}