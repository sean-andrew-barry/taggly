import {Event} from "/js/Event.js";

export class LanguageChange extends Event
{
	static GetLocalName(){ return "languagechange"; }
	static GetMetaURL(){ return import.meta.url; }
}