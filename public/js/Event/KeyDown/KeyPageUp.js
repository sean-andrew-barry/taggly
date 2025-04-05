import {KeyDown} from "/js/Event/KeyDown.js";

export class KeyPageUp extends KeyDown
{
	static GetKeyName(){ return "pageup"; }
	static GetKeyCode(){ return 33; }
	static GetMetaURL(){ return import.meta.url; }
}