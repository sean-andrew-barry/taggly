import {Event} from "/js/Event.js";

export class BeforeInstallPrompt extends Event
{
	static GetLocalName(){ return "beforeinstallprompt"; }
	static GetMetaURL(){ return import.meta.url; }
}