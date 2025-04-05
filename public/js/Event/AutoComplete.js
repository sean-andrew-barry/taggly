import {Event} from "/js/Event.js";

export class AutoComplete extends Event
{
	static GetLocalName(){ return "autocomplete"; }
	static GetMetaURL(){ return import.meta.url; }
}