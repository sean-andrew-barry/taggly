import {KeyDown} from "/js/Event/KeyDown.js";

export class KeyF3 extends KeyDown
{
	static GetKeyName(){ return "f3"; }
	static GetKeyCode(){ return 114; }
	static GetMetaURL(){ return import.meta.url; }
}