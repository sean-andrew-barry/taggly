import {KeyDown} from "/js/Event/KeyDown.js";

export class KeyM extends KeyDown
{
	static GetKeyName(){ return "m"; }
	static GetKeyCode(){ return 77; }
	static GetMetaURL(){ return import.meta.url; }
}