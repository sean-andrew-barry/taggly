import {KeyDown} from "/js/Event/KeyDown.js";

export class KeyPageDown extends KeyDown
{
	static GetKeyName(){ return "pagedown"; }
	static GetKeyCode(){ return 34; }
	static GetMetaURL(){ return import.meta.url; }
}