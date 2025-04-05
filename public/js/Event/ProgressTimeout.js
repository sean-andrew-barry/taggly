import {Event} from "/js/Event.js";

export class ProgressTimeout extends Event
{
	static GetLocalName(){ return "timeout"; }
	static GetMetaURL(){ return import.meta.url; }
}