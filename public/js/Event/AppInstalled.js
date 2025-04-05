import {Event} from "/js/Event.js";

export class AppInstalled extends Event
{
	static GetLocalName(){ return "appinstalled"; }
	static GetMetaURL(){ return import.meta.url; }
}