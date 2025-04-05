import {Event} from "/js/Event.js";

export class FormData extends Event
{
	static GetLocalName(){ return "formdata"; }
	static GetMetaURL(){ return import.meta.url; }
}