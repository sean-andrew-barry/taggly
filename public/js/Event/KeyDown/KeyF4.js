import {KeyDown} from "/js/Event/KeyDown.js";

export class KeyF4 extends KeyDown
{
	static GetKeyName(){ return "f4"; }
	static GetKeyCode(){ return 115; }
	static GetMetaURL(){ return import.meta.url; }
}